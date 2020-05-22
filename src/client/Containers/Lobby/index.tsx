import React, { useState, useEffect, useReducer, useRef } from 'react';
import io from 'socket.io-client';
import playTurn, { getInitialState } from '../../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
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

const useSocket = () => {
  const socketRef = useRef<SocketIOClient.Socket>();
  console.log('[useSocket]: Called');

  if (!socketRef.current) {
    console.log('[useSocket]: Creating new socket');
    socketRef.current = io();
  }

  return socketRef.current;
};

const OnlineGame = ({ history, match }: RouteComponentProps<{ id: string }>) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [status, setStatus] = useState<string | undefined>('');
  const [state, { playTurn, setState }] = useGameReducer();
  const {
    params: { id: room },
  } = match;

  const socket = useSocket();
  console.log('rendering with room:', room);

  useEffect(() => {
    socket.on(Events.LobbyReady, ({ id }: { id: string }) => {
      console.log('got id', id);
      history.replace(`/play/${id}`);
    });

    socket.on(Events.StartGame, ({ id, seat, state }: EventParams[Events.StartGame]) => {
      console.log('room here', room);
      localStorage.setItem(room, id);
      setPlayerId(id);
      setPlayerSeat(seat);
      setState(state);
    });

    socket.on(Events.Sync, ({ state }: EventParams[Events.Sync]) => {
      setState(state);
    });

    socket.on(Events.InvalidTurn, ({ state, error }: EventParams[Events.InvalidTurn]) => {
      setState(state);
      setStatus(error);
    });

    socket.on(
      Events.RejoinedGame,
      ({ state, seat }: EventParams[Events.RejoinedGame]) => {
        setState(state);
        setPlayerSeat(seat);
      }
    );

    return () => {
      console.log('Closing socket');
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (room) {
      const savedId = localStorage.getItem(room);
      if (savedId) {
        setPlayerId(savedId);
        socket.emit(Events.RejoinGame, { id: savedId });
      } else {
        socket.emit(Events.JoinLobby, { room });
      }
    } else {
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
      loading={playerId && !playerSeat}
      shareLink={playerSeat === null && room}
      onFinish={onFinish}
      seat={playerSeat}
      state={state}
      onValidTurn={onValidTurn}
      // doNotValidate
      onInvalidTurn={onInvalidTurn}
      status={status}
      onPlayAgainConfirm={() => {
        socket.emit('restart-game', { room, playerId });
      }}
    />
  );
};

export default OnlineGame;
