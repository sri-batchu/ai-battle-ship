import { Button } from '@/components/ui/button';
import { Trophy, Anchor } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'enemy';
  onRestart: () => void;
}

export const GameOver = ({ winner, onRestart }: GameOverProps) => {
  const isVictory = winner === 'player';

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 px-4 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-6">
        {isVictory ? (
          <>
            <Trophy className="w-24 h-24 sm:w-32 sm:h-32 text-success mx-auto animate-bounce drop-shadow-2xl" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-success drop-shadow-lg">
              🎉 Victory! 🎉
            </h2>
            <p className="text-xl sm:text-2xl text-foreground font-medium">
              You've sunk all enemy ships!
            </p>
            <div className="text-4xl sm:text-5xl animate-pulse">🏆</div>
          </>
        ) : (
          <>
            <Anchor className="w-24 h-24 sm:w-32 sm:h-32 text-destructive mx-auto animate-pulse drop-shadow-2xl" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-destructive drop-shadow-lg">
              💔 Defeat 💔
            </h2>
            <p className="text-xl sm:text-2xl text-foreground font-medium">
              Your fleet has been destroyed...
            </p>
            <div className="text-4xl sm:text-5xl">⚓</div>
          </>
        )}
      </div>

      <Button 
        onClick={onRestart} 
        size="lg" 
        className="text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 hover:scale-110 active:scale-95 transition-transform shadow-2xl"
      >
        🎮 Play Again
      </Button>
    </div>
  );
};
