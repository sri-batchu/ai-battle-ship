import { Board, CellState } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  isEnemy?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showShips?: boolean;
}

export const GameBoard = ({ board, isEnemy = false, onCellClick, showShips = true }: GameBoardProps) => {
  const getCellClassName = (cell: CellState, row: number, col: number) => {
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-grid-border flex items-center justify-center";
    
    // For enemy board, we should never show ships unless they've been hit
    if (isEnemy && cell === 'ship' && !board[row][col].includes('hit')) {
      return cn(
        baseClasses,
        "bg-grid-cell cursor-pointer hover:bg-ocean-primary/20 active:bg-ocean-primary/30"
      );
    }
    
    switch (cell) {
      case 'ship':
        return cn(
          baseClasses,
          showShips 
            ? "bg-ship cursor-default" 
            : "bg-grid-cell cursor-pointer hover:bg-ocean-primary/20 active:bg-ocean-primary/30"
        );
      case 'hit':
        return cn(
          baseClasses, 
          "bg-hit/80 cursor-default relative",
          "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl"
        );
      case 'miss':
        return cn(
          baseClasses, 
          "bg-secondary/30 cursor-default relative",
          "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
        );
      default:
        return cn(
          baseClasses, 
          "bg-grid-cell cursor-pointer",
          isEnemy && onCellClick 
            ? "hover:bg-ocean-primary/20 active:bg-ocean-primary/30" 
            : "cursor-default opacity-75"
        );
    }
  };

  // Function to determine what to display in each cell
  const getCellDisplay = (cell: CellState) => {
    // For enemy board, only show hits and misses
    if (isEnemy) {
      if (cell === 'hit') {
        return (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            "bg-hit/80 cursor-default relative",
            "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl"
          )} />
        );
      }
      if (cell === 'miss') {
        return (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            "bg-secondary/30 cursor-default relative",
            "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
          )} />
        );
      }
      return null; // Hide everything else (including ships) on enemy board
    }
    
    // For player board
    switch (cell) {
      case 'ship':
        return showShips ? <div className="w-full h-full bg-ship" /> : null;
      case 'hit':
        return (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            "bg-hit/80 cursor-default relative",
            "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl"
          )} />
        );
      case 'miss':
        return (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            "bg-secondary/30 cursor-default relative",
            "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
          )} />
        );
      default:
        return null;
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
          row.map((cell, colIndex) => {
            // For enemy board, we only care about 'hit' and 'miss' states
            const cellType = isEnemy ? (cell === 'hit' || cell === 'miss' ? cell : 'empty') : cell;
            const isClickable = isEnemy && onCellClick && (cell === 'empty' || cell === 'ship');
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
                  "border border-grid-border flex items-center justify-center",
                  "transition-colors duration-200",
                  isEnemy ? "bg-grid-cell/50" : "bg-grid-cell",
                  isClickable && "cursor-pointer hover:bg-ocean-primary/20 active:bg-ocean-primary/30"
                )}
                onClick={() => isClickable && onCellClick(rowIndex, colIndex)}
                role={isClickable ? "button" : "presentation"}
                aria-label={isClickable ? `Attack cell ${rowIndex}-${colIndex}` : undefined}
              >
                {getCellDisplay(cellType)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
