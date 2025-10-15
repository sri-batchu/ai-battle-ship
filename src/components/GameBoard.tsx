import { Board, CellState } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  isEnemy?: boolean;
  onCellClick?: (row: number, col: number) => void;
  showShips?: boolean;
  title?: string;
}

export const GameBoard = ({
  board,
  isEnemy = false,
  onCellClick,
  showShips = !isEnemy,
  title,
}: GameBoardProps) => {
  const getCellDisplay = (cell: CellState) => {
    if (isEnemy && !showShips) {
      if (cell === 'hit') {
        return (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-hit/80 cursor-default relative',
              "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl"
            )}
          />
        );
      }
      if (cell === 'miss') {
        return (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-secondary/30 cursor-default relative',
              "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
            )}
          />
        );
      }
      return null;
    }

    switch (cell) {
      case 'ship':
        return showShips ? <div className="w-full h-full bg-ship" /> : null;
      case 'hit':
        return (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-hit/80 cursor-default relative',
              "after:content-['💥'] after:absolute after:text-xl sm:after:text-2xl"
            )}
          />
        );
      case 'miss':
        return (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center',
              'bg-secondary/30 cursor-default relative',
              "after:content-['💦'] after:absolute after:text-lg sm:after:text-xl after:opacity-60"
            )}
          />
        );
      default:
        return null;
    }
  };

  const renderTitle = () => {
    if (title) return title;

    return isEnemy ? (
      <>
        <span className="text-2xl">🎯</span>
        <span>Enemy Waters</span>
      </>
    ) : (
      <>
        <span className="text-2xl">🛡️</span>
        <span>Your Fleet</span>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2 text-center">
        {renderTitle()}
      </h2>
      <div className="w-full overflow-x-auto">
        <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 sm:p-2.5 rounded-xl shadow-xl hover:shadow-glow transition-shadow duration-300 min-w-[18rem]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const effectiveCell: CellState = isEnemy && !showShips
                ? (cell === 'hit' || cell === 'miss' ? cell : 'empty')
                : cell;
              const isClickable =
                isEnemy && !showShips && onCellClick && (cell === 'empty' || cell === 'ship');

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11',
                    'border border-grid-border flex items-center justify-center',
                    'transition-colors duration-200',
                    isEnemy ? 'bg-grid-cell/50' : 'bg-grid-cell',
                    isClickable && 'cursor-pointer hover:bg-ocean-primary/20 active:bg-ocean-primary/30'
                  )}
                  onClick={() => isClickable && onCellClick(rowIndex, colIndex)}
                  role={isClickable ? 'button' : 'presentation'}
                  aria-label={isClickable ? `Attack cell ${rowIndex}-${colIndex}` : undefined}
                >
                  {getCellDisplay(effectiveCell)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
