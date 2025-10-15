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
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-grid-border transition-all duration-300 flex items-center justify-center";
    
    switch (cell) {
      case 'ship':
        return cn(
          baseClasses,
          showShips 
            ? "bg-ship shadow-ship hover:shadow-glow hover:scale-105 cursor-default" 
            : "bg-grid-cell hover:bg-ocean-primary/20 hover:scale-105 cursor-pointer active:scale-95"
        );
      case 'hit':
        return cn(
          baseClasses, 
          "bg-hit animate-pulse shadow-glow cursor-default relative",
          "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl after:animate-bounce"
        );
      case 'miss':
        return cn(
          baseClasses, 
          "bg-secondary cursor-default relative",
          "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
        );
      default:
        return cn(
          baseClasses, 
          "bg-grid-cell cursor-pointer",
          isEnemy && onCellClick 
            ? "hover:bg-ocean-primary/30 hover:scale-110 active:scale-95 hover:shadow-md" 
            : "cursor-default opacity-75"
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
        {isEnemy ? (
          <>
            <span className="text-2xl">🎯</span>
            <span>Enemy Waters</span>
          </>
        ) : (
          <>
            <span className="text-2xl">🛡️</span>
            <span>Your Fleet</span>
          </>
        )}
      </h2>
      <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 sm:p-3 rounded-xl shadow-2xl hover:shadow-glow transition-shadow duration-300">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(cell)}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              role={onCellClick ? "button" : "presentation"}
              aria-label={onCellClick ? `Cell ${rowIndex}-${colIndex}` : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
