import { useEffect, useMemo, useReducer, useRef } from 'react';
import * as T from '../shared/types';

interface IMultiplayerState {
  playerId: null | string;
  playerSeat: null | 1 | 2;
  roomId: null | string;
  isSpectator: boolean;
  restartRequested: boolean;
}

const initialState: IMultiplayerState = {
  playerId: null,
  playerSeat: null,
  roomId: null,
  isSpectator: false,
  restartRequested: false,
};

const Actions = T.Events;

export function reducer(
  state: IMultiplayerState,
  action: { type: T.Events | 'reset' | 'set'; payload?: any }
): IMultiplayerState {
  switch (action.type) {
    case T.Events.LobbyReady: {
      return {
        ...state,
        roomId: action.payload.room,
      };
    }
    case T.Events.StartGame: {
      return {
        ...state,
        playerId: action.payload.id,
        playerSeat: action.payload.seat,
      };
    }
    case T.Events.JoinedLobby: {
      return {
        ...state,
        roomId: action.payload.room,
        playerId: action.payload.id,
      };
    }
    case T.Events.Sync: {
      return {
        ...state,
        playerSeat: action.payload.seat || state.playerSeat,
        restartRequested:
          action.payload.state.turn === 1 ? false : state.restartRequested,
      };
    }
    case T.Events.RejoinedGame: {
      return {
        ...state,
        roomId: action.payload.room,
        playerSeat: action.payload.seat,
      };
    }
    case T.Events.JoinedAsSpectator: {
      return {
        ...state,
        isSpectator: true,
      };
    }
    case T.Events.RestartRequested: {
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

export default function () {
  const [lobbyState, dispatch] = useReducer(reducer, initialState);
  const lobbyStateRef = useRef<IMultiplayerState>(lobbyState);

  useEffect(() => {
    lobbyStateRef.current = lobbyState;
  }, [lobbyState]);

  const dispatchers = useMemo(
    () => ({
      onLobbyReady: (payload: T.EventParams[T.Events.LobbyReady]) =>
        dispatch({ type: T.Events.LobbyReady, payload }),
      onStartGame: (payload: T.EventParams[T.Events.StartGame]) =>
        dispatch({ type: T.Events.StartGame, payload }),
      onJoinedLobby: (payload: T.EventParams[T.Events.JoinedLobby]) =>
        dispatch({ type: T.Events.JoinedLobby, payload }),
      onSync: (payload: T.EventParams[T.Events.Sync]) =>
        dispatch({ type: T.Events.Sync, payload }),
      onRejoinedGame: (payload: T.EventParams[T.Events.RejoinedGame]) =>
        dispatch({ type: T.Events.RejoinedGame, payload }),
      onJoinedAsSpectator: (payload: T.EventParams[T.Events.JoinedAsSpectator]) =>
        dispatch({ type: T.Events.JoinedAsSpectator, payload }),
      onRestartRequested: (payload: T.EventParams[T.Events.RestartRequested]) =>
        dispatch({ type: T.Events.RestartRequested, payload }),
      set: (payload: Partial<IMultiplayerState>) => dispatch({ type: 'set', payload }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    []
  );

  return { lobbyState: lobbyStateRef, dispatchers, lobbyStateRef };
}
