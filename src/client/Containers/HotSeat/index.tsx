import React, { useState } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard';
import * as T from '../../../shared/types';

const HotSeat = () => {
  const [gameState, setGameState] = useState(getInitialState());
  const [status, setStatus] = useState('');
  const [flashing, setFlashing] = useState(false);

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = gameState.currentPlayer;

    const { state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
  };

  const onInvalidTurn = (error: T.Errors) => {
    setStatus(error);
  };

  return (
    <Board
      onFinish={() => window.alert('Game finished!')}
      state={gameState}
      status={status}
      seat={gameState.currentPlayer}
      onValidTurn={onValidTurn}
      onInvalidTurn={onInvalidTurn}
    />
  );
};

export default HotSeat;
