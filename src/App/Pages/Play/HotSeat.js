import React, { useState } from 'react';
import playTurn, { initialState } from '../../../game';
import GameBoard from './GameBoard';

const HotSeat = () => {
  const [gameState, setGameState] = useState(initialState);

  const play = ({ board, cell }) => {
    const { currentPlayer: player } = gameState;

    const nextState = playTurn(gameState, { player, board, cell });

    setGameState(nextState.state);
  };

  return <GameBoard state={gameState} playTurn={play} />;
};

export default HotSeat;
