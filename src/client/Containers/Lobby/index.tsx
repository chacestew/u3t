import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import playTurn, { getInitialState } from '../../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard';
import { match, RouteComponentProps } from 'react-router-dom';
import {
  IGameState,
  Events,
  EventParams,
  Player,
  Board as BoardType,
  Board as CellType,
  Errors,
} from '../../../shared/types';

const socket = io();

const OnlineGame = ({
  history,
  match: {
    params: { id: room },
  },
}: RouteComponentProps<{ id: string }>) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [gameState, setGameState] = useState(getInitialState());
  const [status, setStatus] = useState<string | undefined>('');

  useEffect(() => {
    socket.on(Events.LobbyReady, ({ id }: { id: string }) => {
      console.log('got id', id);
      history.replace(`/play/${id}`);
    });

    socket.on(Events.StartGame, (data: EventParams[Events.StartGame]) => {
      setPlayerId(data.id);
      setPlayerSeat(data.seat);
      setGameState(data.state);
    });

    socket.on(Events.Sync, (data: EventParams[Events.Sync]) => {
      setGameState(data.state);
    });

    socket.on(Events.InvalidTurn, (data: EventParams[Events.InvalidTurn]) => {
      setGameState(data.state);
      setStatus(data.error);
    });

    return () => {
      console.log('Closing socket');
      socket.close();
    };
  }, [history]);

  useEffect(() => {
    if (room) {
      console.log('Joining lobby...', room);
      socket.emit(Events.JoinLobby, { room });
    } else {
      console.log('Creating lobby');
      socket.emit(Events.CreateLobby);
    }
  }, [room]);

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const player = playerSeat as Player;
    const id = playerId;

    const { state } = playTurn(gameState, { player, board, cell });

    setGameState(state);
    socket.emit('play-turn', { room, id, player, board, cell });
  };

  const onInvalidTurn = (error: Errors) => {
    setStatus(error);
  };

  const onFinish = () => {
    setTimeout(() => {
      true && socket.emit('restart-game', { room, playerId });
    }, 1000);
  };

  if (playerSeat === null && room) {
    return `Share this to your friend: ${room}`;
  }

  return (
    <Board
      onFinish={onFinish}
      seat={playerSeat}
      state={gameState}
      onValidTurn={onValidTurn}
      doNotValidate
      onInvalidTurn={onInvalidTurn}
      status={status}
    />
  );
};

export default OnlineGame;
