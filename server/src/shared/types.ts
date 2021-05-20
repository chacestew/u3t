import { Server, Socket } from 'socket.io';

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
  GameStarted = 'start-game',
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
  Resync = 'resync',
}

export type ServerError = 'not-found' | 'will-expire';

export type ErrorParams = {
  code: ServerError;
  errorData?: { [key: string]: string };
};

export type SocketCallback<ResponsePayload> = (payload: ResponsePayload) => void;

// CreateLobby

export type CreateLobbyResponse = {
  lobbyId: string;
  playerId: string;
};

// JoinLobby

export interface JoinLobbyRequestArgs {
  lobbyId: string;
  playerId?: string;
  spectator?: boolean;
}

export type JoinLobbyResponses =
  | JoinLobbyResponse_NewPlayer
  | JoinLobbyResponse_Reconnection
  | JoinLobbyResponse_Spectator;

export interface JoinLobbyResponse_NewPlayer {
  lobbyId: string;
  playerId: string;
  role: 'new-player';
}

export interface JoinLobbyResponse_Spectator {
  lobbyId: string;
  state: IGameState;
  role: 'spectator';
}

export interface JoinLobbyResponse_Reconnection {
  lobbyId: string;
  state: IGameState;
  seat: Player;
  role: 'reconnected-player';
}

// Auth

interface IdFields {
  lobbyId: string;
  playerId: string;
}

// PlayTurn

export interface PlayTurnRequestArgs extends IdFields {
  board: Board;
  cell: Cell;
  dev: boolean;
}

export interface PlayTurnResponse {
  valid: boolean;
  error?: Errors;
}

// GameStarted

export interface GameStarted extends IdFields {
  seat: Player;
  state: IGameState;
}

// RejoinGame

export type ResyncArgs = IdFields;

// Restart

export type RestartRequestArgs = IdFields;

// Forfeit

export type ForfeitRequestArgs = IdFields;

// Sync

export interface Sync {
  state: IGameState;
  seat?: Player;
}

// LobbyReady

export interface LobbyReady {
  lobbyId: string;
}

export const emitter = <Args>(event: Events) => (socket: Socket, args?: Args) =>
  socket.emit(event, args);

export const ioEmitter = <Args>(event: Events) => (io: Server, to: string, args?: Args) =>
  io.to(to).emit(event, args);

// export type On = <E>(
//   event: E & Events,
//   fn: (params: EventParams[typeof event]) => any
// ) => unknown;

// export type Emit = <E>(
//   event: E & Events,
//   eventParams?: EventParams[typeof event]
// ) => unknown;
