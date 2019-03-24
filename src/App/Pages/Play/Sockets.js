import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import playTurn, { initialState } from '../../../game';
import GameBoard from './GameBoard';

const socket = io('/game');

const Sockets = ({
  match: {
    params: { id: room },
  },
}) => {
  const [playerSeat, setPlayerSeat] = useState(null);
  const [gameState, setGameState] = useState(initialState);
  const [turnStartTime, setTurnStartTime] = useState(null);

  useEffect(() => {
    socket.on('game-started', data => {
      console.log('Got game-started', data);
      setPlayerSeat(data.seat);
      setGameState(data.state);
      setTurnStartTime(data.time);
    });

    socket.on('sync', data => {
      console.log('Got sync', data);
      setGameState(data.state);
    });

    socket.emit('join-lobby', { room });

    return () => {
      socket.close();
    };
  }, []);

  const play = ({ board, cell }) => {
    const player = playerSeat;

    const nextState = playTurn(gameState, { player, board, cell });

    setGameState(nextState.state);
    socket.emit('play-turn', { room, player, board, cell });
  };

  if (playerSeat === null) {
    if (room) {
      return `Share this to your friend: ${room}`;
    }
  }

  return (
    <GameBoard
      seat={playerSeat}
      state={gameState}
      playTurn={play}
      turnStartTime={turnStartTime}
    />
  );
};

export default Sockets;
