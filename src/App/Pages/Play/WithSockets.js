import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const nine = e => Array(9).fill(e);

const initialState = {
  turn: 0,
  currentPlayer: 1,
  currentBoard: null,
  winner: null,
  boards: nine({ winner: null, cells: nine(null) }),
  currentBoard: null,
  currentPlayer: 1,
  winner: null,
};

const socket = io();

const GameWithSockets = props => {
  const [playerSeat, setPlayerSeat] = useState(null);
  const [gameState, setGameState] = useState(initialState);

  useEffect(() => {
    socket.open();

    // Join room (or create a new one)
    socket.emit('join', { room: 'a1' });

    //

    // Both players ready
    socket.on('start', data => {
      setPlayerSeat(data.seat);
    });

    socket.on('sync', data => {
      setGameState(data.state);
    });

    return () => {
      socket.close();
    };
  });

  if (!playerSeat) return 'Loading...';

  return <Game seat={playerSeat} state={gameState} />;
};
