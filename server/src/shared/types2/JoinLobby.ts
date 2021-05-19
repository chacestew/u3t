import { IGameState, Player } from './types';
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
