import type { PlayerStats } from '@/types/game';
import { calculateAccuracy } from '@/utils/gameLogic';

interface FleetStatsCardProps {
  label: string;
  shots: PlayerStats;
  shipsSunk: number;
  accent?: 'ally' | 'enemy';
}

const accentStyles: Record<NonNullable<FleetStatsCardProps['accent']>, string> = {
  ally: 'from-ocean-primary/15 via-background to-ocean-primary/5 border-ocean-primary/40',
  enemy: 'from-destructive/15 via-background to-destructive/5 border-destructive/30',
};

export const FleetStatsCard = ({ label, shots, shipsSunk, accent = 'ally' }: FleetStatsCardProps) => {
  const accuracy = calculateAccuracy(shots.hits, shots.shotsFired);

  return (
    <section
      className={`rounded-2xl border bg-gradient-to-br ${accentStyles[accent]} p-5 shadow-lg space-y-3 transition-transform hover:scale-[1.01]`}
      aria-label={`${label} statistics`}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{label}</h3>
        <span className="text-sm font-medium text-muted-foreground">
          Accuracy: <span className="text-foreground">{accuracy}%</span>
        </span>
      </header>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
        <div className="space-y-1">
          <dt className="text-muted-foreground">Shots</dt>
          <dd className="font-semibold text-foreground">{shots.shotsFired}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">Hits</dt>
          <dd className="font-semibold text-foreground">{shots.hits}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">Misses</dt>
          <dd className="font-semibold text-foreground">{shots.misses}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-muted-foreground">Ships sunk</dt>
          <dd className="font-semibold text-foreground">{shipsSunk}</dd>
        </div>
      </dl>
    </section>
  );
};
