import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import playTurn, { initialState } from '../../../game';
import GameBoard from './GameBoard';

const socket = io();

const Sockets = () => {
  const [room, setRoom] = useState(null);
  const [playerSeat, setPlayerSeat] = useState(null);
  const [gameState, setGameState] = useState(initialState);

  useEffect(() => {
    socket.open();

    socket.emit('join-queue');

    socket.on('found-match', data => {
      setRoom(data.room);
      socket.emit('join', { room: data.room });
    });

    // Both players ready
    socket.on('start', data => {
      console.log('I am started!', gameState);
    });

    socket.on('sync', data => {
      console.log('got sync request!', data);
      setGameState(data.state);
    });

    socket.on('joined', data => {
      setPlayerSeat(data.seat);
      console.log('I am joined!', data.seat);
    });

    return () => {
      socket.close();
    };
  }, []);

  const play = ({ board, cell }) => {
    const player = playerSeat;

    const nextState = playTurn(gameState, { player, board, cell });

    setGameState(nextState.state);
    socket.emit('play', { room, player, board, cell });
  };

  if (playerSeat === null) return 'Loading...';

  return <GameBoard seat={playerSeat} state={gameState} playTurn={play} />;
};

export default Sockets;
