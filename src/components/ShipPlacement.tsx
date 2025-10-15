import { Board, Ship } from '@/types/game';
import { Button } from '@/components/ui/button';
import { canPlaceShip, GRID_SIZE } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';
import { RotateCw, Undo } from 'lucide-react';

interface ShipPlacementProps {
  board: Board;
  ships: Ship[];
  currentShip: number | null;
  orientation: 'horizontal' | 'vertical';
  onCellClick: (row: number, col: number) => void;
  onOrientationToggle: () => void;
  onRandomPlacement: () => void;
  onUndo: () => void;
  onShipSelect: (index: number) => void;
}


export const ShipPlacement = ({
  board,
  ships,
  currentShip,
  orientation,
  onCellClick,
  onOrientationToggle,
  onRandomPlacement,
  onUndo,
  onShipSelect,
}: ShipPlacementProps) => {
  const selectedShip = currentShip !== null ? ships[currentShip] : null;

  const getCellClassName = (row: number, col: number) => {
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-grid-border transition-all duration-300 flex items-center justify-center";
    const cell = board[row][col];

    if (cell === 'ship') {
      return cn(baseClasses, "bg-ship shadow-ship hover:shadow-glow cursor-default scale-105");
    }

    const canPlaceShipHere = selectedShip && canPlaceShip(board, row, col, selectedShip.length, orientation);
    if (canPlaceShipHere) {
      return cn(
        baseClasses, 
        "bg-grid-cell hover:bg-ocean-light/40 cursor-pointer hover:scale-110 active:scale-95",
        "hover:shadow-lg hover:border-ocean-light animate-in fade-in duration-200"
      );
    }

    return cn(baseClasses, "bg-grid-cell/50 cursor-not-allowed opacity-40");
  };

  if (selectedShip === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-2xl font-bold">Select a Ship to Place</h2>
        <div className="flex gap-2 flex-wrap justify-center">
          {ships.map((ship, index) => (
            <button
              key={ship.name}
              onClick={() => onShipSelect?.(index)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors",
                ship.placed 
                  ? "bg-green-600 text-white" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
              disabled={ship.placed}
            >
              {ship.name} ({ship.length})
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4">
      <div className="text-center space-y-3 animate-in fade-in duration-500">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">⚓ Place Your Ships</h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Placing: <span className="text-ocean-light font-bold text-lg sm:text-xl">{selectedShip.name}</span> 
          <span className="text-sm sm:text-base"> (Length: {selectedShip.length})</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center w-full">
        <Button 
          onClick={onOrientationToggle} 
          variant="outline" 
          className="gap-2 hover:scale-105 transition-transform active:scale-95 shadow-md"
          size="lg"
        >
          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</span>
          <span className="sm:hidden">{orientation === 'horizontal' ? 'H' : 'V'}</span>
        </Button>
        <Button 
          onClick={onUndo} 
          variant="outline" 
          className="gap-2 hover:scale-105 transition-transform active:scale-95 shadow-md" 
          disabled={currentShip === 0}
          size="lg"
        >
          <Undo className="w-4 h-4 sm:w-5 sm:h-5" />
          Undo
        </Button>
        <Button 
          onClick={onRandomPlacement} 
          variant="secondary"
          className="gap-2 hover:scale-105 transition-transform active:scale-95 shadow-md"
          size="lg"
        >
          <span className="hidden sm:inline">🎲 Auto-place Ships</span>
          <span className="sm:hidden">🎲 Auto</span>
        </Button>
      </div>

      <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 sm:p-3 rounded-xl shadow-2xl hover:shadow-glow transition-shadow duration-300">
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
              role="button"
              aria-label={`Place ship at ${rowIndex}-${colIndex}`}
            />
          ))
        )}
      </div>

      <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
        {ships.map((s, idx) => (
          <div
            key={s.name}
            className={cn(
              "px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
              "hover:scale-105 shadow-md",
              s.placed
                ? "bg-success text-success-foreground animate-in slide-in-from-bottom"
                : idx === currentShip
                ? "bg-ocean-light text-primary-foreground ring-2 ring-ocean-light/50 ring-offset-2 ring-offset-background"
                : "bg-secondary text-secondary-foreground opacity-70"
            )}
          >
            {s.placed && <span className="mr-1">✓</span>}
            {s.name} ({s.length})
          </div>
        ))}
      </div>
    </div>
  );
};
