import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import playTurn, { getInitialState } from '../../../shared/game.ts';
import Board from '../GameArea/GlobalBoard';

const socket = io();

const OnlineGame = ({
  history,
  match: {
    params: { id: room },
  },
}) => {
  const [playerId, setPlayerId] = useState(null);
  const [playerSeat, setPlayerSeat] = useState(null);
  const [gameState, setGameState] = useState(getInitialState());
  const [turnStartTime, setTurnStartTime] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('lobby-ready', ({ id }) => {
      history.replace(`/play/${id}`);
    });

    socket.on('game-started', data => {
      console.log('Got game-started', data);
      setPlayerId(data.id);
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

    return () => {
      console.log('Closing socket');
      socket.close();
    };
  }, [history]);

  useEffect(() => {
    if (room) {
      console.log('Joining lobby...', room);
      socket.emit('join-lobby', { room });
    } else {
      console.log('Creating lobby');
      socket.emit('create-lobby');
    }
  }, [room]);

  const play = ({ board, cell }) => {
    const player = playerSeat;
    const id = playerId;

    const { error, state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
    setStatus(error);
    socket.emit('play-turn', { room, id, player, board, cell });
  };

  const onFinish = () => {
    setTimeout(() => {
      true && socket.emit('restart-game', { room, playerId });
    }, 1000);
  };

  if (playerSeat === null) {
    if (room) {
      return `Share this to your friend: ${room}`;
    }
  }

  return (
    <Board
      onFinish={onFinish}
      seat={playerSeat}
      state={gameState}
      playTurn={play}
      turnStartTime={turnStartTime}
      status={status}
    />
  );
};

export default OnlineGame;
