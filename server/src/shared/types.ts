export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Board = Cell;
export type Player = 1 | 2;

export interface IBoardState {
  winner: null | Player;
  cells: Array<Player | null>;
  cellsOpen: number;
}

export interface IGameState {
  turn: number;
  turnList: ITurnInput[];
  currentPlayer: Player;
  boards: Array<IBoardState>;
  activeBoard: Board[];
  winner: null | Player;
  winningSet: number[];
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
  GameIsFinished = 'GameIsFinished',
  WrongTurn = 'WrongTurn',
  BoardNotPlayable = 'Board not playable',
  CellOccupied = 'Cell is occupied',
}

export enum Events {
  CreateLobby = 'create-lobby',
  LobbyReady = 'lobby-ready',
  StartGame = 'start-game',
  RejoinGame = 'rejoin-game',
  RejoinedGame = 'rejoined-game',
  JoinLobby = 'join-lobby',
  PlayTurn = 'play-turn',
  InvalidTurn = 'invalid-turn',
  Sync = 'sync',
  Restart = 'restart-game',
  RestartRequested = 'restart-requested',
  JoinedAsSpectator = 'joined-as-spectator',
  Disconnect = 'disconnect',
  Error = 'error',
  Forfeit = 'forfeit',
  JoinedLobby = 'joined-lobby',
}

export type ServerError = 'not-found' | 'will-expire';

export type ErrorParams = {
  code: ServerError;
  errorData?: { [key: string]: string };
};

export interface EventParams {
  [Events.JoinLobby]: {
    room: string;
    id?: string;
  };
  [Events.CreateLobby]: {
    id: string;
  };
  [Events.PlayTurn]: {
    id: string;
    room: string;
    board: Board;
    cell: Cell;
    dev: boolean;
  };
  [Events.StartGame]: {
    room: string;
    id: string;
    seat: Player;
    state: IGameState;
  };
  [Events.RejoinGame]: {
    id: string;
  };
  [Events.RejoinedGame]: {
    room: string;
    seat: Player;
    state: IGameState;
  };
  [Events.Sync]: {
    state: IGameState;
    seat: Player;
  };
  [Events.InvalidTurn]: {
    state: IGameState;
    error: Errors;
  };
  [Events.Restart]: {
    id: string;
    room: string;
  };
  [Events.JoinedAsSpectator]: {
    state: IGameState;
  };
  [Events.RestartRequested]: null;
  [Events.LobbyReady]: {
    room: string;
  };
  [Events.Error]: ErrorParams;
  [Events.Forfeit]: {
    room: string;
    id: string;
  };
  [Events.JoinedLobby]: {
    id: string;
    room: string;
  };
}

export type On = <E>(
  event: E & Events,
  fn: (params: EventParams[typeof event]) => any
) => unknown;

export type Emit = <E>(
  event: E & Events,
  eventParams?: EventParams[typeof event]
) => unknown;
