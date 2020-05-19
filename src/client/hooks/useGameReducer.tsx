import { useReducer } from 'react';
import playTurn, { getInitialState } from '../../shared/game';
import * as T from '../../shared/types';

const last = (array: any[]) => array[array.length - 1];

function reducer(
  state: T.IGameState[],
  action: { type: string; payload: T.IGameState | T.ITurnInput }
) {
  switch (action.type) {
    case 'PLAY-TURN': {
      const player = 1;
      const { board, cell } = action.payload as T.ITurnInput;
      const { state: nextState } = playTurn(last(state), { player, board, cell });
      return state.concat(nextState);
    }
    case 'SET-STATE': {
      const next = [...state];
      state[state.length - 1] = action.payload as T.IGameState;
      return next;
    }
    default:
      return state;
  }
}

interface Dispatchers {
  playTurn: (payload: T.ITurnInput) => void;
  setState: (payload: T.IGameState) => void;
}

export default function(): [T.IGameState[], Dispatchers] {
  const [state, dispatch] = useReducer(reducer, [getInitialState()]);
  const dispatchers = {
    playTurn: (payload: T.ITurnInput) => {
      dispatch({ type: 'PLAY-TURN', payload });
    },
    setState: (payload: T.IGameState) => {
      dispatch({ type: 'SET-STATE', payload });
    },
  };
  return [state, dispatchers];
}
