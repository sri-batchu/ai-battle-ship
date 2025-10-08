import { Board, CellState } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  isEnemy?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showShips?: boolean;
}

export const GameBoard = ({ board, isEnemy = false, onCellClick, showShips = true }: GameBoardProps) => {
  const getCellClassName = (cell: CellState) => {
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 border border-grid-border transition-all duration-200 cursor-pointer";
    
    switch (cell) {
      case 'ship':
        return cn(
          baseClasses,
          showShips ? "bg-ship shadow-ship" : "bg-grid-cell hover:bg-secondary"
        );
      case 'hit':
        return cn(baseClasses, "bg-hit animate-pulse shadow-glow");
      case 'miss':
        return cn(baseClasses, "bg-secondary relative after:content-['○'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-miss after:text-lg");
      default:
        return cn(baseClasses, "bg-grid-cell hover:bg-secondary hover:scale-105");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        {isEnemy ? 'Enemy Waters' : 'Your Fleet'}
      </h2>
      <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 rounded-lg shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(cell)}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};
