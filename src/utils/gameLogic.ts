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

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 'empty' || board[row][col] === 'ship') {
        availableCells.push([row, col]);
      }
    }
  }

  if (availableCells.length === 0) {
    return [0, 0];
  }

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  return availableCells[randomIndex];
};
