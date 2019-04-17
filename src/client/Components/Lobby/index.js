import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import playTurn, { initialState } from '../../../shared/game';
import Board from '../GameArea/GlobalBoard';

const socket = io('/game');

const OnlineGame = ({
  match: {
    params: { id: room },
  },
}) => {
  const [playerSeat, setPlayerSeat] = useState(null);
  const [gameState, setGameState] = useState(initialState);
  const [turnStartTime, setTurnStartTime] = useState(null);
  const [status, setStatus] = useState();

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

    socket.on('invalid-turn', data => {
      setStatus(data);
    });

    socket.emit('join-lobby', { room });

    return () => {
      socket.close();
    };
  }, [room]);

  const play = ({ board, cell }) => {
    const player = playerSeat;

    const { error, state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
    socket.emit('play-turn', { room, player, board, cell });
  };

  if (playerSeat === null) {
    if (room) {
      return `Share this to your friend: ${room}`;
    }
  }

  return (
    <Board
      seat={playerSeat}
      state={gameState}
      playTurn={play}
      turnStartTime={turnStartTime}
      status={status}
    />
  );
};

export default OnlineGame;
