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
}: ShipPlacementProps) => {
  const selectedShip = currentShip !== null ? ships[currentShip] : null;

  const getCellClassName = (row: number, col: number) => {
    const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 border border-grid-border transition-all duration-200";
    const cell = board[row][col];

    if (cell === 'ship') {
      return cn(baseClasses, "bg-ship shadow-ship");
    }

    const canPlaceShipHere = selectedShip && canPlaceShip(board, row, col, selectedShip.length, orientation);
    if (canPlaceShipHere) {
      return cn(baseClasses, "bg-grid-cell hover:bg-primary/30 cursor-pointer hover:scale-105");
    }

    return cn(baseClasses, "bg-grid-cell cursor-not-allowed opacity-50");
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
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Place Your Ships</h2>
        <p className="text-muted-foreground">
          Placing: <span className="text-primary font-semibold">{selectedShip.name}</span> (Length: {selectedShip.length})
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={onOrientationToggle} variant="outline" className="gap-2">
          <RotateCw className="w-4 h-4" />
          {orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}
        </Button>
        <Button onClick={onUndo} variant="outline" className="gap-2" disabled={currentShip === 0}>
          <Undo className="w-4 h-4" />
          Undo
        </Button>
        <Button onClick={onRandomPlacement} variant="secondary">
          Auto-place Ships
        </Button>
      </div>

      <div className="inline-grid grid-cols-10 gap-0.5 bg-grid-border p-2 rounded-lg shadow-lg">
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {ships.map((s, idx) => (
          <div
            key={s.name}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-all",
              s.placed
                ? "bg-success text-success-foreground"
                : idx === currentShip
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
};
