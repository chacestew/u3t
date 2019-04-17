import React, { useState } from 'react';
import playTurn, { initialState, generateRandomMove } from '../../../shared/game';
import Board from '../GameArea/GlobalBoard';

const HotSeat = () => {
  const [gameState, setGameState] = useState(initialState);

  const play = ({ board, cell }) => {
    const { currentPlayer: player } = gameState;

    const { error, state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
  };

  // const play = (state = initialState) => {
  //   const randomTurn = generateRandomMove(state);
  //   const { state: nextState } = playTurn(state, randomTurn);
  //   if (nextState.winner) {
  //     return setGameState(nextState);
  //   }
  //   return play(nextState);
  // };

  return <Board state={gameState} playTurn={play} />;
};

export default HotSeat;
