import { Button } from '@/components/ui/button';
import { Trophy, Anchor } from 'lucide-react';
import { GameBoard } from '@/components/GameBoard';
import { Board, GameStats, Ship } from '@/types/game';
import { countSunkShips } from '@/utils/gameLogic';
import { FleetStatsCard } from '@/components/FleetStatsCard';

interface GameOverProps {
  winner: 'player' | 'enemy';
  onRestart: () => void;
  playerBoard: Board;
  enemyBoard: Board;
  playerShips: Ship[];
  enemyShips: Ship[];
  stats: GameStats;
}

export const GameOver = ({
  winner,
  onRestart,
  playerBoard,
  enemyBoard,
  playerShips,
  enemyShips,
  stats,
}: GameOverProps) => {
  const isVictory = winner === 'player';

  const shipsSunkByPlayer = countSunkShips(enemyShips, enemyBoard);
  const shipsSunkByEnemy = countSunkShips(playerShips, playerBoard);

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-10 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        {isVictory ? (
          <>
            <Trophy className="w-20 h-20 sm:w-24 sm:h-24 text-success mx-auto drop-shadow-2xl" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-success drop-shadow-lg">
              Fleet Victorious
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Enemy fleet eliminated. Outstanding command.
            </p>
          </>
        ) : (
          <>
            <Anchor className="w-20 h-20 sm:w-24 sm:h-24 text-destructive mx-auto drop-shadow-2xl" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-destructive drop-shadow-lg">
              Fleet Lost
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our ships were sunk. Regroup and try again.
            </p>
          </>
        )}
      </div>

      <div className="w-full max-w-6xl space-y-8">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <FleetStatsCard label="Your Fleet" shots={stats.player} shipsSunk={shipsSunkByPlayer} accent="ally" />
          <FleetStatsCard label="Enemy Fleet" shots={stats.enemy} shipsSunk={shipsSunkByEnemy} accent="enemy" />
        </div>

        <section className="grid gap-6 lg:grid-cols-2" aria-label="Final battle boards">
          <div className="rounded-2xl border border-border/40 bg-background/80 p-4 shadow-lg">
            <GameBoard board={playerBoard} showShips title="Final Status: Your Fleet" />
          </div>
          <div className="rounded-2xl border border-border/40 bg-background/80 p-4 shadow-lg">
            <GameBoard board={enemyBoard} isEnemy showShips title="Final Status: Enemy Fleet" />
          </div>
        </section>
      </div>

      <Button
        onClick={onRestart}
        size="lg"
        className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 hover:scale-105 active:scale-95 transition-transform shadow-xl"
      >
        🎮 Play Again
      </Button>
    </div>
  );
};
