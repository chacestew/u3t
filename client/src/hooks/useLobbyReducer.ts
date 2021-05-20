import { useEffect, useMemo, useReducer, useRef } from 'react';
import {
  Events,
  GameStarted,
  JoinLobbyResponse_NewPlayer,
  JoinLobbyResponse_Reconnection,
  JoinLobbyResponse_Spectator,
  Sync,
} from '../shared/types2/types';

export interface IMultiplayerState {
  playerId: null | string;
  playerSeat: null | 1 | 2;
  roomId: null | string;
  isSpectator: boolean;
  restartRequested: boolean;
  started: boolean;
}

const initialState: IMultiplayerState = {
  playerId: null,
  playerSeat: null,
  roomId: null,
  isSpectator: false,
  restartRequested: false,
  started: false,
};

export function reducer(
  state: IMultiplayerState,
  action: { type: Events | 'reset' | 'set'; payload?: any }
): IMultiplayerState {
  switch (action.type) {
    case Events.LobbyReady: {
      return {
        ...state,
        roomId: action.payload.lobbyId,
      };
    }
    case Events.GameStarted: {
      return {
        ...state,
        started: true,
        playerId: action.payload.playerId,
        playerSeat: action.payload.seat,
      };
    }
    case Events.JoinedLobby: {
      return {
        ...state,
        roomId: action.payload.lobbyId,
        playerId: action.payload.playerId,
      };
    }
    case Events.Sync: {
      return {
        ...state,
        playerSeat: action.payload.seat || state.playerSeat,
        restartRequested:
          action.payload.state.turn === 1 ? false : state.restartRequested,
      };
    }
    case Events.RejoinedGame: {
      return {
        ...state,
        roomId: action.payload.lobbyId,
        playerSeat: action.payload.seat,
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
        ...action.payload,
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

  const dispatchers = useMemo(
    () => ({
      // onLobbyReady: (payload: LobbyReady) =>
      //   dispatch({ type: Events.LobbyReady, payload }),
      onStartGame: (payload: GameStarted) =>
        dispatch({ type: Events.GameStarted, payload }),
      onJoinedLobby: (payload: JoinLobbyResponse_NewPlayer) =>
        dispatch({ type: Events.JoinedLobby, payload }),
      onSync: (payload: Sync) => dispatch({ type: Events.Sync, payload }),
      onRejoinedGame: (payload: JoinLobbyResponse_Reconnection) =>
        dispatch({ type: Events.RejoinedGame, payload }),
      onJoinedAsSpectator: (payload: JoinLobbyResponse_Spectator) =>
        dispatch({ type: Events.JoinedAsSpectator, payload }),
      onRestartRequested: () => dispatch({ type: Events.RestartRequested }),
      set: (payload: Partial<IMultiplayerState>) => dispatch({ type: 'set', payload }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    []
  );

  return { lobbyState, dispatchers, lobbyStateRef };
}
