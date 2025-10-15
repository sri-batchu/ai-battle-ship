export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export type Ship = {
  name: string;
  length: number;
  placed: boolean;
  positions: [number, number][];
};

export type Board = CellState[][];

export type GamePhase = 'placement' | 'ready' | 'battle' | 'gameover';

export type GameState = {
  phase: GamePhase;
  playerBoard: Board;
  enemyBoard: Board;
  playerShips: Ship[];
  enemyShips: Ship[];
  currentShip: number;
  shipOrientation: 'horizontal' | 'vertical';
  isPlayerTurn: boolean;
  winner: 'player' | 'enemy' | null;
};
