import React, { useState } from 'react';
import playTurn, { initialState } from '../../../shared/game';
import GameBoard from './GameBoard';

const HotSeat = () => {
  const [gameState, setGameState] = useState(initialState);

  const play = ({ board, cell }) => {
    const { currentPlayer: player } = gameState;

    const { error, state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
  };

  return <GameBoard state={gameState} playTurn={play} />;
};

export default HotSeat;
