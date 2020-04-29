export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Board = Cell;
export type Player = 1 | 2;

export interface IBoardState {
  winner: null | Player;
  cells: Array<number | null>;
  cellsOpen: Cell;
  tied: boolean;
}

export interface IGameState {
  turn: number;
  currentPlayer: Player;
  boards: Array<IBoardState>;
  activeBoard: null | number;
  winner: null | Player;
  winningSet: null | number[];
  totalCellsOpen: number;
  tied: boolean;
  finished: boolean;
}

export interface ITurnInput {
  player: Player;
  board: Board;
  cell: Cell;
}

export enum Errors {
  WrongTurn = 'WrongTurn',
  BoardNotPlayable = 'Board not playable',
  CellOccupied = 'Cell is occupied',
}

export enum Events {
  CreateLobby = 'create-lobby',
  LobbyReady = 'lobby-ready',
  JoinLobby = 'join-lobby',
  PlayTurn = 'play-turn',
  InvalidTurn = 'invalid-turn',
  Sync = 'sync',
  Restart = 'restart-game',
}
