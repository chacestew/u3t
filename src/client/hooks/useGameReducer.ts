import { useReducer } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../shared/game';
import * as T from '../../shared/types';

function instantEnd(state: T.IGameState): T.IGameState {
  const turn = generateRandomMove(state);

  const nextState = playTurn(state, turn).state;

  if (nextState.finished) return nextState;

  return instantEnd(nextState);
}

function reducer(
  state: T.IGameState,
  action: { type: string; payload?: T.IGameState | T.ITurnInput }
): T.IGameState {
  switch (action.type) {
    case 'PLAY-TURN': {
      if ((window as any).dev === true) {
        return instantEnd(state);
      }
      const turnInput = action.payload as T.ITurnInput;
      return playTurn(state, turnInput).state;
    }
    case 'SET-STATE': {
      return action.payload as T.IGameState;
    }
    case 'RESTART': {
      return getInitialState();
    }
    default:
      return state;
  }
}

interface Dispatchers {
  playTurn: (payload: T.ITurnInput) => void;
  setState: (payload: T.IGameState) => void;
  restart: () => void;
}

export default function(): [T.IGameState, Dispatchers] {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const dispatchers = {
    playTurn: (payload: T.ITurnInput) => {
      dispatch({ type: 'PLAY-TURN', payload });
    },
    setState: (payload: T.IGameState) => {
      dispatch({ type: 'SET-STATE', payload });
    },
    restart: () => {
      dispatch({ type: 'RESTART' });
    },
  };
  return [state, dispatchers];
}
