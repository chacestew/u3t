import React, { useState, useEffect, useReducer } from 'react';
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

import useGameReducer from '../../hooks/useGameReducer';

const socket = io();

const OnlineGame = ({
  history,
  match: {
    params: { id: room },
  },
}: RouteComponentProps<{ id: string }>) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [status, setStatus] = useState<string | undefined>('');
  const [state, { playTurn, setState }] = useGameReducer();

  useEffect(() => {
    socket.on(Events.LobbyReady, ({ id }: { id: string }) => {
      console.log('got id', id);
      history.replace(`/play/${id}`);
    });

    socket.on(Events.StartGame, (data: EventParams[Events.StartGame]) => {
      setPlayerId(data.id);
      setPlayerSeat(data.seat);
      setState(data.state);
    });

    socket.on(Events.Sync, (data: EventParams[Events.Sync]) => {
      setState(data.state);
    });

    socket.on(Events.InvalidTurn, (data: EventParams[Events.InvalidTurn]) => {
      setState(data.state);
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

    playTurn({ player, board, cell });
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

  return (
    <Board
      shareLink={playerSeat === null && room}
      onFinish={onFinish}
      seat={playerSeat}
      state={state}
      onValidTurn={onValidTurn}
      // doNotValidate
      onInvalidTurn={onInvalidTurn}
      status={status}
    />
  );
};

export default OnlineGame;
