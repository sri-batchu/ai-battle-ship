import { useState } from 'react';
import { GameState } from '@/types/game';
import { Button } from '@/components/ui/button';
import {
  createEmptyBoard,
  createInitialShips,
  placeShip,
  canPlaceShip,
  placeShipsRandomly,
  makeAttack,
  checkAllShipsSunk,
  getAIMove,
} from '@/utils/gameLogic';
import { ShipPlacement } from '@/components/ShipPlacement';
import { BattlePhase } from '@/components/BattlePhase';
import { GameOver } from '@/components/GameOver';
import { Anchor, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showToast, clearToasts } from '@/utils/toast';

const Index = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(() => {
    const { board: enemyBoard, ships: enemyShips } = placeShipsRandomly();
    return {
      phase: 'placement',
      playerBoard: createEmptyBoard(),
      enemyBoard,
      playerShips: createInitialShips(),
      enemyShips,
      currentShip: 0,
      shipOrientation: 'horizontal',
      isPlayerTurn: true,
      winner: null,
    };
  });

  const [selectedShipIndex, setSelectedShipIndex] = useState<number | null>(0);

  const handleShipSelect = (index: number) => {
    const ship = gameState.playerShips[index];
    if (!ship.placed) {
      setSelectedShipIndex(index);
    }
  };

  const handlePlacementClick = (row: number, col: number) => {
    if (gameState.phase !== 'placement' || selectedShipIndex === null) return;

    const ship = gameState.playerShips[selectedShipIndex];
    if (!ship || ship.placed) return;

    if (!canPlaceShip(gameState.playerBoard, row, col, ship.length, gameState.shipOrientation)) {
      showToast('Cannot place ship here');
      return;
    }

    const newBoard = [...gameState.playerBoard];
    const newShips = [...gameState.playerShips];
    const newShip = { ...ship };
    newShip.placed = true;
    newShip.positions = [];

    for (let i = 0; i < ship.length; i++) {
      const newRow = gameState.shipOrientation === 'horizontal' ? row : row + i;
      const newCol = gameState.shipOrientation === 'horizontal' ? col + i : col;
      newBoard[newRow][newCol] = 'ship';
      newShip.positions.push([newRow, newCol]);
    }

    newShips[selectedShipIndex] = newShip;

    // Find next unplaced ship
    const nextShipIndex = newShips.findIndex(s => !s.placed);

    setGameState(prevState => ({
      ...prevState,
      playerBoard: newBoard,
      playerShips: newShips,
      currentShip: nextShipIndex,
    }));

    setSelectedShipIndex(nextShipIndex);

    if (nextShipIndex === -1) {
      showToast('All ships placed! Ready to start battle!');
      setGameState(prevState => ({
        ...prevState,
        phase: 'ready',
      }));
    } else {
      showToast(`Placed ${ship.name}!`);
    }
  };

  const startBattle = () => {
    showToast('Battle begins! Good luck!');
    setGameState(prevState => ({
      ...prevState,
      phase: 'battle',
    }));
  };

  const handleOrientationToggle = () => {
    setGameState({
      ...gameState,
      shipOrientation: gameState.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal',
    });
  };

  const handleRandomPlacement = () => {
    const { board, ships } = placeShipsRandomly();
    setGameState({
      ...gameState,
      playerBoard: board,
      playerShips: ships,
      phase: 'ready',
    });
    setSelectedShipIndex(null);
    showToast("Ships placed randomly! Ready to start battle!");
  };

  const handleUndo = () => {
    // Find the last placed ship using findLastIndex for better accuracy
    const lastPlacedShipIndex = gameState.playerShips.reduce((lastIndex, ship, currentIndex) => {
      return ship.placed && ship.positions.length > 0 ? currentIndex : lastIndex;
    }, -1);

    if (lastPlacedShipIndex === -1) return;

    const shipToRemove = gameState.playerShips[lastPlacedShipIndex];

    // Create new board without the last placed ship
    const newBoard = gameState.playerBoard.map(row => [...row]);
    shipToRemove.positions.forEach(([row, col]) => {
      newBoard[row][col] = 'empty';
    });

    // Update ships array
    const newShips = [...gameState.playerShips];
    newShips[lastPlacedShipIndex] = {
      ...shipToRemove,
      placed: false,
      positions: [],
    };

    // Update both selectedShipIndex and currentShip to maintain consistency
    setSelectedShipIndex(lastPlacedShipIndex);

    setGameState(prevState => ({
      ...prevState,
      playerBoard: newBoard,
      playerShips: newShips,
      phase: 'placement',
      currentShip: lastPlacedShipIndex,
    }));

    showToast(`Removed ${shipToRemove.name}`);
  };

  const handleEnemyAttack = (row: number, col: number) => {
    if (!gameState.isPlayerTurn || gameState.phase !== 'battle') return;

    const cell = gameState.enemyBoard[row][col];
    if (cell === 'hit' || cell === 'miss') {
      showToast('You already attacked this position');
      return;
    }

    const { board: newEnemyBoard, result } = makeAttack(gameState.enemyBoard, row, col);
    
    showToast(result === 'hit' ? 'Hit!' : 'Miss!');

    if (checkAllShipsSunk(gameState.enemyShips, newEnemyBoard)) {
      setGameState({
        ...gameState,
        enemyBoard: newEnemyBoard,
        phase: 'gameover',
        winner: 'player',
      });
      return;
    }

    setGameState({
      ...gameState,
      enemyBoard: newEnemyBoard,
      isPlayerTurn: false,
    });

    setTimeout(() => {
      const [aiRow, aiCol] = getAIMove(gameState.playerBoard);
      const { board: newPlayerBoard, result: aiResult } = makeAttack(
        gameState.playerBoard,
        aiRow,
        aiCol
      );

      showToast(aiResult === 'hit' ? 'Enemy hit your ship!' : 'Enemy missed!');

      if (checkAllShipsSunk(gameState.playerShips, newPlayerBoard)) {
        setGameState(prev => ({
          ...prev,
          playerBoard: newPlayerBoard,
          enemyBoard: newEnemyBoard,
          phase: 'gameover',
          winner: 'enemy',
        }));
        return;
      }

      setGameState(prev => ({
        ...prev,
        playerBoard: newPlayerBoard,
        enemyBoard: newEnemyBoard,
        isPlayerTurn: true,
      }));
    }, 200);
  };

  const handleRestart = () => {
    clearToasts();
    const { board: enemyBoard, ships: enemyShips } = placeShipsRandomly();
    const initialShips = createInitialShips();
    
    setGameState({
      phase: 'placement',
      playerBoard: createEmptyBoard(),
      enemyBoard,
      playerShips: initialShips,
      enemyShips,
      currentShip: 0, // Explicitly set to 0 for Carrier
      shipOrientation: 'horizontal',
      isPlayerTurn: true,
      winner: null,
    });
    
    // Reset selected ship to Carrier
    setSelectedShipIndex(0);
    
    // Force a re-render of the ship selection
    setTimeout(() => {
      setSelectedShipIndex(0);
    }, 0);
    
    showToast('New game started! Place your Carrier (5 cells)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-deep via-background to-ocean-deep p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8 md:mb-10 relative animate-in fade-in duration-700">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full hover:bg-ocean-primary/20 transition-all hover:scale-110 active:scale-95 shadow-md"
            aria-label="Return to home"
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-ocean-light" />
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 drop-shadow-lg">
            <Anchor className="inline-block mr-2 text-ocean-light animate-pulse" />
            AI Battleship
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium">
            {gameState.phase === 'placement' 
              ? '🚢 Place your ships on the grid' 
              : gameState.phase === 'battle'
              ? '⚔️ Battle in progress!' 
              : '🎮 Game Over'}
          </p>
        </header>

        {gameState.phase === 'placement' && (
          <ShipPlacement
            board={gameState.playerBoard}
            ships={gameState.playerShips}
            currentShip={selectedShipIndex}
            orientation={gameState.shipOrientation}
            onCellClick={handlePlacementClick}
            onOrientationToggle={handleOrientationToggle}
            onRandomPlacement={handleRandomPlacement}
            onUndo={handleUndo}
            onShipSelect={handleShipSelect}
          />
        )}

        {gameState.phase === 'ready' && (
          <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">🚀 Ready for Battle!</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                All ships are in position. Ready to start the battle?
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={startBattle}
                className="px-8 py-6 text-lg font-bold bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
                size="lg"
              >
                Start Battle
              </Button>
              <Button 
                onClick={() => {
                  setGameState(prevState => ({
                    ...prevState,
                    phase: 'placement',
                  }));
                  setSelectedShipIndex(gameState.playerShips.length - 1);
                }}
                variant="outline"
                className="px-6 py-6 text-lg"
                size="lg"
              >
                Adjust Ships
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 sm:p-3 rounded-xl shadow-2xl hover:shadow-glow transition-shadow duration-300">
                {gameState.playerBoard.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-grid-border ${
                        cell === 'ship' ? 'bg-ship' : 'bg-grid-cell/50'
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {gameState.phase === 'battle' && (
          <BattlePhase
            playerBoard={gameState.playerBoard}
            enemyBoard={gameState.enemyBoard}
            isPlayerTurn={gameState.isPlayerTurn}
            onEnemyCellClick={handleEnemyAttack}
            onRestart={handleRestart}
          />
        )}

        {gameState.phase === 'gameover' && gameState.winner && (
          <GameOver winner={gameState.winner} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default Index;
