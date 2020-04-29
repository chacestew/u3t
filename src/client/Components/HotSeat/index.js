import React, { useState } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../../shared/game.ts';
import Board from '../GameArea/GlobalBoard';

const HotSeat = () => {
  const [gameState, setGameState] = useState(getInitialState());
  const [status, setStatus] = useState('');
  const [flashing, setFlashing] = useState(false);

  const play = ({ board, cell }) => {
    const { currentPlayer: player } = gameState;

    const { error, state } = playTurn(gameState, { player, board, cell });
    console.log('???', error && error.startsWith('Chose wrong board'));
    if (error && error.startsWith('Chose wrong board')) {
      setFlashing(state.activeBoard);
      console.log('ayo', error[error.length - 1]);
      setTimeout(() => {
        setFlashing(false);
      }, 500);
    }

    setStatus(error);
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

  return (
    <Board
      onFinish={() => console.log('ALLO')}
      flashing={flashing}
      state={gameState}
      playTurn={play}
      status={status}
    />
  );
};

export default HotSeat;
