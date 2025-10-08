import { Button } from '@/components/ui/button';
import { Trophy, Anchor } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'enemy';
  onRestart: () => void;
}

export const GameOver = ({ winner, onRestart }: GameOverProps) => {
  const isVictory = winner === 'player';

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="text-center space-y-4">
        {isVictory ? (
          <>
            <Trophy className="w-24 h-24 text-success mx-auto animate-bounce" />
            <h2 className="text-4xl sm:text-5xl font-bold text-success">Victory!</h2>
            <p className="text-xl text-foreground">
              You've sunk all enemy ships! 🎉
            </p>
          </>
        ) : (
          <>
            <Anchor className="w-24 h-24 text-destructive mx-auto" />
            <h2 className="text-4xl sm:text-5xl font-bold text-destructive">Defeat</h2>
            <p className="text-xl text-foreground">
              Your fleet has been destroyed...
            </p>
          </>
        )}
      </div>

      <Button onClick={onRestart} size="lg" className="text-lg px-8">
        Play Again
      </Button>
    </div>
  );
};
