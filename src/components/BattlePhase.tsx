import { Board } from '@/types/game';
import { GameBoard } from '@/components/GameBoard';
import { Button } from '@/components/ui/button';
import { Crosshair, Shield, RotateCcw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BattlePhaseProps {
  playerBoard: Board;
  enemyBoard: Board;
  isPlayerTurn: boolean;
  onEnemyCellClick: (row: number, col: number) => void;
  onRestart: () => void;
  onAutoPlay?: () => void;
}

export const BattlePhase = ({
  playerBoard,
  enemyBoard,
  isPlayerTurn,
  onEnemyCellClick,
  onRestart,
  onAutoPlay,
}: BattlePhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full px-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">⚔️ Battle</h2>
        <div className={cn(
          "flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl p-4 rounded-xl",
          isPlayerTurn
            ? "bg-ocean-primary/20 shadow-lg shadow-ocean-primary/30"
            : "bg-accent/20 shadow-lg shadow-accent/30"
        )}>
          {isPlayerTurn ? (
            <>
              <Crosshair className="w-6 h-6 sm:w-7 sm:h-7 text-ocean-light" />
              <span className="text-ocean-light font-bold">Your move</span>
            </>
          ) : (
            <>
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              <span className="text-accent font-bold">Enemy acting</span>
            </>
          )}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button
            onClick={onRestart}
            variant="outline"
            size="default"
            className="gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            Restart
          </Button>
          {onAutoPlay && (
            <Button
              onClick={onAutoPlay}
              variant="secondary"
              size="default"
              className="gap-2 shadow-md"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Play for Me
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_auto] xl:grid-cols-[auto_auto_auto] gap-6 sm:gap-8 xl:gap-12 items-center w-full max-w-7xl justify-center">
        <div className={cn("transition-opacity", !isPlayerTurn && "opacity-70")}>
          <GameBoard
            board={playerBoard}
            isEnemy={false}
            showShips={true}
          />
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <div className="text-4xl font-bold text-ocean-light">⚡</div>
        </div>
        <div className={cn("transition-opacity", isPlayerTurn ? "opacity-100" : "opacity-70")}>
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
