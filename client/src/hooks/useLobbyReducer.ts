import { useEffect, useReducer, useRef } from 'react';
import {
  Events,
  GameStarted,
  JoinLobbyResponse_NewPlayer,
  JoinLobbyResponse_Reconnection,
  JoinLobbyResponse_Spectator,
  Sync,
} from '../shared/types';

export interface IMultiplayerState {
  playerId: null | string;
  playerSeat: null | 1 | 2;
  lobbyId: null | string;
  isSpectator: boolean;
  restartRequested: boolean;
  started: boolean;
}

const initialState: IMultiplayerState = {
  playerId: null,
  playerSeat: null,
  lobbyId: null,
  isSpectator: false,
  restartRequested: false,
  started: false,
};

type Action =
  | { event: Events.GameStarted; data: GameStarted }
  | { event: Events.JoinedLobby; data: JoinLobbyResponse_NewPlayer }
  | { event: Events.Sync; data: Sync }
  | { event: Events.RejoinedGame; data: JoinLobbyResponse_Reconnection }
  | { event: Events.JoinedAsSpectator; data: JoinLobbyResponse_Spectator }
  | { event: Events.RestartRequested }
  | { event: 'set'; data: Partial<IMultiplayerState> }
  | { event: 'reset' };

export function reducer(state: IMultiplayerState, action: Action): IMultiplayerState {
  switch (action.event) {
    case Events.GameStarted: {
      return {
        ...state,
        started: true,
        playerId: action.data.playerId,
        playerSeat: action.data.seat,
      };
    }
    case Events.JoinedLobby: {
      return {
        ...state,
        lobbyId: action.data.lobbyId,
        playerId: action.data.playerId,
      };
    }
    case Events.Sync: {
      return {
        ...state,
        playerSeat: action.data.seat || state.playerSeat,
        restartRequested: action.data.state.turn === 1 ? false : state.restartRequested,
      };
    }
    case Events.RejoinedGame: {
      return {
        ...state,
        lobbyId: action.data.lobbyId,
        playerSeat: action.data.seat,
      };
    }
    case Events.JoinedAsSpectator: {
      return {
        ...state,
        isSpectator: true,
      };
    }
    case Events.RestartRequested: {
      return {
        ...state,
        restartRequested: true,
      };
    }
    case 'set': {
      return {
        ...state,
        ...action.data,
      };
    }
    case 'reset': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

export default function (passedState: Partial<IMultiplayerState>) {
  const [lobbyState, dispatch] = useReducer(reducer, { ...initialState, ...passedState });
  const lobbyStateRef = useRef<IMultiplayerState>(lobbyState);

  useEffect(() => {
    lobbyStateRef.current = lobbyState;
  }, [lobbyState]);

  return { lobbyState, lobbyStateRef, dispatch };
}
