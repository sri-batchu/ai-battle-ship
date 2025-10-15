import { Board } from '@/types/game';
import { GameBoard } from '@/components/GameBoard';
import { Button } from '@/components/ui/button';
import { Crosshair, Shield, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BattlePhaseProps {
  playerBoard: Board;
  enemyBoard: Board;
  isPlayerTurn: boolean;
  onEnemyCellClick: (row: number, col: number) => void;
  onRestart: () => void;
}

export const BattlePhase = ({
  playerBoard,
  enemyBoard,
  isPlayerTurn,
  onEnemyCellClick,
  onRestart,
}: BattlePhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full px-4">
      <div className="text-center space-y-4 animate-in fade-in duration-500">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">⚔️ Battle Phase</h2>
        <div className={cn(
          "flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl p-4 rounded-xl transition-all duration-300",
          isPlayerTurn 
            ? "bg-ocean-primary/20 shadow-lg shadow-ocean-primary/30 animate-pulse" 
            : "bg-accent/20 shadow-lg shadow-accent/30"
        )}>
          {isPlayerTurn ? (
            <>
              <Crosshair className="w-6 h-6 sm:w-7 sm:h-7 text-ocean-light animate-bounce" />
              <span className="text-ocean-light font-bold">Your Turn - Attack!</span>
            </>
          ) : (
            <>
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-accent animate-spin" />
              <span className="text-accent font-bold">Enemy's Turn...</span>
            </>
          )}
        </div>
        <Button 
          onClick={onRestart} 
          variant="outline" 
          size="default" 
          className="gap-2 hover:scale-105 transition-transform active:scale-95 shadow-md"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          Restart Game
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:gap-12 items-center xl:items-start w-full max-w-7xl justify-center">
        <div className={cn(
          "transition-all duration-300",
          !isPlayerTurn && "opacity-70 scale-95"
        )}>
          <GameBoard
            board={playerBoard}
            isEnemy={false}
            showShips={true}
          />
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <div className="text-4xl font-bold text-ocean-light animate-pulse">⚡</div>
        </div>
        <div className={cn(
          "transition-all duration-300",
          isPlayerTurn ? "ring-2 ring-ocean-light ring-offset-4 ring-offset-background rounded-2xl p-2" : "opacity-70 scale-95"
        )}>
          <GameBoard
            board={enemyBoard}
            isEnemy={true}
            showShips={false}
            onCellClick={isPlayerTurn ? onEnemyCellClick : undefined}
          />
        </div>
      </div>
    </div>
  );
};
