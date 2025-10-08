import { Board } from '@/types/game';
import { GameBoard } from '@/components/GameBoard';
import { Crosshair, Shield } from 'lucide-react';

interface BattlePhaseProps {
  playerBoard: Board;
  enemyBoard: Board;
  isPlayerTurn: boolean;
  onEnemyCellClick: (row: number, col: number) => void;
}

export const BattlePhase = ({
  playerBoard,
  enemyBoard,
  isPlayerTurn,
  onEnemyCellClick,
}: BattlePhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Battle Phase</h2>
        <div className="flex items-center justify-center gap-2 text-lg">
          {isPlayerTurn ? (
            <>
              <Crosshair className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">Your Turn - Attack!</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold">Enemy's Turn...</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start">
        <GameBoard
          board={playerBoard}
          isEnemy={false}
          showShips={true}
        />
        <GameBoard
          board={enemyBoard}
          isEnemy={true}
          showShips={false}
          onCellClick={isPlayerTurn ? onEnemyCellClick : undefined}
        />
      </div>
    </div>
  );
};
