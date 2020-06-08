import React, { useState } from 'react';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import * as T from '../../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';

const HotSeat = () => {
  const [{ gameState, turnList }, { playTurn }] = useGameReducer();
  const [status, setStatus] = useState('');

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = gameState.currentPlayer;

    playTurn({ player, board, cell });
  };

  const onInvalidTurn = (error: T.Errors) => {
    setStatus(error);
  };

  return (
    <Board
      onFinish={() => false && window.alert('Game finished!')}
      state={gameState}
      turnList={turnList}
      status={status}
      seat={gameState.currentPlayer}
      onValidTurn={onValidTurn}
      onInvalidTurn={onInvalidTurn}
    />
  );
};

export default HotSeat;
