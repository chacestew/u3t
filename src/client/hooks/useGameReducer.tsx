import { useReducer } from 'react';
import playTurn, { getInitialState } from '../../shared/game';
import * as T from '../../shared/types';

interface State {
  turnList: T.ITurnInput[];
  gameState: T.IGameState;
}

function reducer(
  state: State,
  action: { type: string; payload: T.IGameState | T.ITurnInput }
): State {
  switch (action.type) {
    case 'PLAY-TURN': {
      const turnInput = action.payload as T.ITurnInput;
      const { turnList, gameState } = state;

      return {
        turnList: turnList.concat(turnInput),
        gameState: playTurn(gameState, turnInput).state,
      };
    }
    case 'SET-STATE': {
      return { ...state, gameState: action.payload as T.IGameState };
    }
    default:
      return state;
  }
}

interface Dispatchers {
  playTurn: (payload: T.ITurnInput) => void;
  setState: (payload: T.IGameState) => void;
}

export default function(): [State, Dispatchers] {
  const [state, dispatch] = useReducer(reducer, {
    turnList: [],
    gameState: getInitialState(),
  });
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
