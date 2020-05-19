import React, { useState } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard';
import * as T from '../../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';

const HotSeat = () => {
  const [state, { playTurn }] = useGameReducer();
  const [status, setStatus] = useState('');
  const [flashing, setFlashing] = useState(false);
  const gameState = state[state.length - 1];

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = gameState.currentPlayer;

    playTurn({ player, board, cell });
  };

  const onInvalidTurn = (error: T.Errors) => {
    setStatus(error);
  };

  return (
    <>
      <Board
        onFinish={() => window.alert('Game finished!')}
        state={gameState}
        status={status}
        seat={gameState.currentPlayer}
        onValidTurn={onValidTurn}
        onInvalidTurn={onInvalidTurn}
      />
      <div>
        <input type="range" id="volume" name="volume" min="0" max="11"></input>
        <label htmlFor="volume">Volume</label>
      </div>
    </>
  );
};

export default HotSeat;
