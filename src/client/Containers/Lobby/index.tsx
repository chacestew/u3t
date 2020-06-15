import React, { useState, useEffect } from 'react';

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
import { Header } from '../../Components/GameArea/Header/Header';
import useSocket from '../../hooks/useSocket';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';

const OnlineGame = ({ history, match }: RouteComponentProps<{ id: string }>) => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [restartRequested, setRestartRequested] = useState(false);
  const [{ gameState, turnList }, { playTurn, setState }] = useGameReducer();

  const socket = useSocket();

  const {
    params: { id: room },
  } = match;

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
      setRestartRequested(false);
    });

    socket.on(Events.Sync, ({ state }: EventParams[Events.Sync]) => {
      setState(state);
    });

    socket.on(Events.InvalidTurn, ({ state, error }: EventParams[Events.InvalidTurn]) => {
      setState(state);
    });

    socket.on(
      Events.JoinedAsSpectator,
      ({ state }: EventParams[Events.JoinedAsSpectator]) => {
        setIsSpectator(true);
        setState(state);
      }
    );

    socket.on(
      Events.RejoinedGame,
      ({ state, seat }: EventParams[Events.RejoinedGame]) => {
        setState(state);
        setPlayerSeat(seat);
      }
    );

    socket.on(Events.RestartRequested, () => {
      setRestartRequested(true);
    });

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
    socket.emit(Events.PlayTurn, { room, id, player, board, cell, dev: window.dev });
  };

  const restartGame = () => {
    socket.emit(Events.Restart, { id: playerId });
  };

  const headerMode = isSpectator
    ? 'spectator'
    : room && !playerSeat
    ? 'share'
    : playerSeat
    ? 'online'
    : 'loading';

  return (
    <>
      <Header
        room={room}
        state={gameState}
        seat={playerSeat!}
        mode={headerMode}
        onPlayAgainConfirm={restartGame}
        restartRequested={restartRequested}
      />
      <RelativeBox>
        <Board seat={playerSeat} state={gameState} onValidTurn={onValidTurn} />
        <TurnList turnList={turnList} />
      </RelativeBox>
    </>
  );
};

export default OnlineGame;
