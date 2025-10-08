import { useState } from 'react';
import { GameState } from '@/types/game';
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
import { toast } from 'sonner';
import { Anchor } from 'lucide-react';

const Index = () => {
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

  const handlePlacementClick = (row: number, col: number) => {
    if (gameState.phase !== 'placement') return;

    const ship = gameState.playerShips[gameState.currentShip];
    if (!ship || ship.placed) return;

    if (!canPlaceShip(gameState.playerBoard, row, col, ship.length, gameState.shipOrientation)) {
      toast.error("Can't place ship here!");
      return;
    }

    const { board: newBoard, positions } = placeShip(
      gameState.playerBoard,
      row,
      col,
      ship.length,
      gameState.shipOrientation
    );

    const newShips = [...gameState.playerShips];
    newShips[gameState.currentShip] = { ...ship, placed: true, positions };

    const nextShip = gameState.currentShip + 1;
    
    setGameState({
      ...gameState,
      playerBoard: newBoard,
      playerShips: newShips,
      currentShip: nextShip,
      phase: nextShip >= gameState.playerShips.length ? 'battle' : 'placement',
    });

    if (nextShip >= gameState.playerShips.length) {
      toast.success("All ships placed! Battle begins!");
    }
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
      phase: 'battle',
    });
    toast.success("Ships placed randomly! Battle begins!");
  };

  const handleUndo = () => {
    if (gameState.currentShip === 0) return;

    const previousShipIndex = gameState.currentShip - 1;
    const shipToRemove = gameState.playerShips[previousShipIndex];

    // Create new board without the last placed ship
    const newBoard = gameState.playerBoard.map(r => [...r]);
    shipToRemove.positions.forEach(([row, col]) => {
      newBoard[row][col] = 'empty';
    });

    // Update ships array
    const newShips = [...gameState.playerShips];
    newShips[previousShipIndex] = {
      ...shipToRemove,
      placed: false,
      positions: [],
    };

    setGameState({
      ...gameState,
      playerBoard: newBoard,
      playerShips: newShips,
      currentShip: previousShipIndex,
      phase: 'placement',
    });

    toast.info(`Removed ${shipToRemove.name}`);
  };

  const handleEnemyAttack = (row: number, col: number) => {
    if (!gameState.isPlayerTurn || gameState.phase !== 'battle') return;

    const cell = gameState.enemyBoard[row][col];
    if (cell === 'hit' || cell === 'miss') {
      toast.error("Already attacked this cell!");
      return;
    }

    const { board: newEnemyBoard, result } = makeAttack(gameState.enemyBoard, row, col);
    
    toast.success(result === 'hit' ? '🎯 Hit!' : '💦 Miss!');

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
      const [aiRow, aiCol] = getAIMove(newEnemyBoard);
      const { board: newPlayerBoard, result: aiResult } = makeAttack(
        gameState.playerBoard,
        aiRow,
        aiCol
      );

      toast.info(aiResult === 'hit' ? '💥 Enemy hit your ship!' : '💧 Enemy missed!');

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
    }, 1500);
  };

  const handleRestart = () => {
    const { board: enemyBoard, ships: enemyShips } = placeShipsRandomly();
    setGameState({
      phase: 'placement',
      playerBoard: createEmptyBoard(),
      enemyBoard,
      playerShips: createInitialShips(),
      enemyShips,
      currentShip: 0,
      shipOrientation: 'horizontal',
      isPlayerTurn: true,
      winner: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-ocean flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Anchor className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Battleship</h1>
          </div>
          <p className="text-muted-foreground text-lg">Sink the enemy fleet!</p>
        </div>

        {gameState.phase === 'placement' && (
          <ShipPlacement
            board={gameState.playerBoard}
            ships={gameState.playerShips}
            currentShip={gameState.currentShip}
            orientation={gameState.shipOrientation}
            onCellClick={handlePlacementClick}
            onOrientationToggle={handleOrientationToggle}
            onRandomPlacement={handleRandomPlacement}
            onUndo={handleUndo}
          />
        )}

        {gameState.phase === 'battle' && (
          <BattlePhase
            playerBoard={gameState.playerBoard}
            enemyBoard={gameState.enemyBoard}
            isPlayerTurn={gameState.isPlayerTurn}
            onEnemyCellClick={handleEnemyAttack}
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
