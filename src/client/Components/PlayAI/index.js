import React, { useState, useEffect } from 'react';
import playTurn, { initialState, generateRandomMove } from '../../../shared/game';
import Board from '../GameArea/GlobalBoard';

const PlayAI = () => {
  const [gameState, setGameState] = useState(initialState);
  const [seat, setSeat] = useState(null);

  useEffect(() => {
    const yourSeat = Math.ceil(Math.random() * 2);
    console.log('you are player:', yourSeat);
    setSeat(yourSeat);
  }, []);

  useEffect(() => {
    if (seat === null || gameState.currentPlayer === seat) return;
    setTimeout(() => {
      const randomTurn = generateRandomMove(gameState);
      const { state: nextState } = playTurn(gameState, randomTurn);
      setGameState(nextState);
    }, 1000);
  }, [gameState, seat]);

  const play = ({ board, cell }) => {
    const { error, state } = playTurn(gameState, { player: seat, board, cell });

    if (!error) {
      setGameState(state);
    }
  };

  return <Board state={gameState} playTurn={play} />;
};

export default PlayAI;
