import React, { useState } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import * as T from '../../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';

const HotSeat = () => {
  const [state, { playTurn }] = useGameReducer();
  const [status, setStatus] = useState('');
  const [flashing, setFlashing] = useState(false);

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = state.currentPlayer;

    playTurn({ player, board, cell });
  };

  const onInvalidTurn = (error: T.Errors) => {
    setStatus(error);
  };

  return (
    <Board
      onFinish={() => window.alert('Game finished!')}
      state={state}
      status={status}
      seat={state.currentPlayer}
      onValidTurn={onValidTurn}
      onInvalidTurn={onInvalidTurn}
    />
  );
};

export default HotSeat;
