import { Board, Ship, CellState } from '@/types/game';

export const GRID_SIZE = 10;

export const SHIPS: Omit<Ship, 'placed' | 'positions'>[] = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Destroyer', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Patrol Boat', length: 2 },
];

export const createEmptyBoard = (): Board => {
  return Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill('empty' as CellState)
  );
};

export const createInitialShips = (): Ship[] => {
  return SHIPS.map(ship => ({
    ...ship,
    placed: false,
    positions: [],
  }));
};

export const canPlaceShip = (
  board: Board,
  row: number,
  col: number,
  length: number,
  orientation: 'horizontal' | 'vertical'
): boolean => {
  if (orientation === 'horizontal') {
    if (col + length > GRID_SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row][col + i] === 'ship') return false;
    }
  } else {
    if (row + length > GRID_SIZE) return false;
    for (let i = 0; i < length; i++) {
      if (board[row + i][col] === 'ship') return false;
    }
  }
  return true;
};

export const placeShip = (
  board: Board,
  row: number,
  col: number,
  length: number,
  orientation: 'horizontal' | 'vertical'
): { board: Board; positions: [number, number][] } => {
  const newBoard = board.map(r => [...r]);
  const positions: [number, number][] = [];

  if (orientation === 'horizontal') {
    for (let i = 0; i < length; i++) {
      newBoard[row][col + i] = 'ship';
      positions.push([row, col + i]);
    }
  } else {
    for (let i = 0; i < length; i++) {
      newBoard[row + i][col] = 'ship';
      positions.push([row + i, col]);
    }
  }

  return { board: newBoard, positions };
};

export const placeShipsRandomly = (): { board: Board; ships: Ship[] } => {
  let board = createEmptyBoard();
  const ships = createInitialShips();

  ships.forEach(ship => {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceShip(board, row, col, ship.length, orientation)) {
        const result = placeShip(board, row, col, ship.length, orientation);
        board = result.board;
        ship.positions = result.positions;
        ship.placed = true;
        placed = true;
      }
    }
  });

  return { board, ships };
};

export const makeAttack = (
  board: Board,
  row: number,
  col: number
): { board: Board; result: 'hit' | 'miss' } => {
  const newBoard = board.map(r => [...r]);
  const cell = newBoard[row][col];

  if (cell === 'ship') {
    newBoard[row][col] = 'hit';
    return { board: newBoard, result: 'hit' };
  } else if (cell === 'empty') {
    newBoard[row][col] = 'miss';
    return { board: newBoard, result: 'miss' };
  }

  return { board: newBoard, result: 'miss' };
};

export const checkAllShipsSunk = (ships: Ship[], board: Board): boolean => {
  return ships.every(ship => {
    return ship.positions.every(([row, col]) => board[row][col] === 'hit');
  });
};

export const getAIMove = (board: Board): [number, number] => {
  const availableCells: [number, number][] = [];
  const hitCells: [number, number][] = [];

  // Find all available cells and hit cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 'empty' || board[row][col] === 'ship') {
        availableCells.push([row, col]);
      } else if (board[row][col] === 'hit') {
        hitCells.push([row, col]);
      }
    }
  }

  // If we have hits, try to find a pattern to follow
  if (hitCells.length > 0) {
    // Look for consecutive hits in a line (horizontal or vertical)
    const horizontalHits: [number, number][] = [];
    const verticalHits: [number, number][] = [];
    
    // Group hits by row and column
    const hitsByRow = new Map<number, number[]>();
    const hitsByCol = new Map<number, number[]>();
    
    for (const [row, col] of hitCells) {
      if (!hitsByRow.has(row)) hitsByRow.set(row, []);
      if (!hitsByCol.has(col)) hitsByCol.set(col, []);
      hitsByRow.get(row)!.push(col);
      hitsByCol.get(col)!.push(row);
    }
    
    // Find potential ship lines
    for (const [row, cols] of hitsByRow) {
      if (cols.length >= 2) {
        const sortedCols = cols.sort((a, b) => a - b);
        for (let i = 0; i < sortedCols.length - 1; i++) {
          if (sortedCols[i + 1] - sortedCols[i] === 1) {
            // Found consecutive horizontal hits
            const startCol = sortedCols[i];
            const endCol = sortedCols[i + 1];
            
            // Check for available cells at the ends
            if (startCol > 0 && (board[row][startCol - 1] === 'empty' || board[row][startCol - 1] === 'ship')) {
              return [row, startCol - 1];
            }
            if (endCol < GRID_SIZE - 1 && (board[row][endCol + 1] === 'empty' || board[row][endCol + 1] === 'ship')) {
              return [row, endCol + 1];
            }
          }
        }
      }
    }
    
    for (const [col, rows] of hitsByCol) {
      if (rows.length >= 2) {
        const sortedRows = rows.sort((a, b) => a - b);
        for (let i = 0; i < sortedRows.length - 1; i++) {
          if (sortedRows[i + 1] - sortedRows[i] === 1) {
            // Found consecutive vertical hits
            const startRow = sortedRows[i];
            const endRow = sortedRows[i + 1];
            
            // Check for available cells at the ends
            if (startRow > 0 && (board[startRow - 1][col] === 'empty' || board[startRow - 1][col] === 'ship')) {
              return [startRow - 1, col];
            }
            if (endRow < GRID_SIZE - 1 && (board[endRow + 1][col] === 'empty' || board[endRow + 1][col] === 'ship')) {
              return [endRow + 1, col];
            }
          }
        }
      }
    }
    
    // If no clear pattern, just target adjacent cells to any hit
    const targetCells: [number, number][] = [];
    for (const [hitRow, hitCol] of hitCells) {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dRow, dCol] of directions) {
        const newRow = hitRow + dRow;
        const newCol = hitCol + dCol;
        if (newRow >= 0 && newRow < GRID_SIZE && 
            newCol >= 0 && newCol < GRID_SIZE &&
            (board[newRow][newCol] === 'empty' || board[newRow][newCol] === 'ship')) {
          targetCells.push([newRow, newCol]);
        }
      }
    }
    
    if (targetCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * targetCells.length);
      return targetCells[randomIndex];
    }
  }

  // If no hits or no clear pattern, use a more strategic search
  // Use a checkerboard pattern to maximize coverage
  const checkerboardCells: [number, number][] = [];
  const otherCells: [number, number][] = [];
  
  for (const [row, col] of availableCells) {
    if ((row + col) % 2 === 0) {
      checkerboardCells.push([row, col]);
    } else {
      otherCells.push([row, col]);
    }
  }
  
  // Prefer checkerboard pattern for better coverage
  const targetPool = checkerboardCells.length > 0 ? checkerboardCells : otherCells;
  
  if (targetPool.length === 0) {
    return [0, 0];
  }

  const randomIndex = Math.floor(Math.random() * targetPool.length);
  return targetPool[randomIndex];
};
