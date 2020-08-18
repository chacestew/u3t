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
  const [playerId, setPlayerId] = useState('');
  const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [restartRequested, setRestartRequested] = useState(false);
  const [state, { playTurn, setState, restart }] = useGameReducer();

  const { socket, onEvent, emitEvent } = useSocket();

  const {
    params: { id: room },
  } = match;

  useEffect(() => {
    onEvent(Events.LobbyReady, ({ id, room: _room }) => {
      if (room === _room) return;
      if (id) {
        localStorage.setItem(room, id);
        setPlayerId(id);
      }
      history.replace(`/play/${_room}`);
    });

    onEvent(Events.StartGame, ({ id, seat, state }) => {
      localStorage.setItem(room, id);
      setPlayerId(id);
      setPlayerSeat(seat);
      setState(state);
      setRestartRequested(false);
    });

    onEvent(Events.JoinedLobby, ({ id }) => {
      setPlayerId(id);
    });

    onEvent(Events.Sync, ({ state, seat }) => {
      if (seat) setPlayerSeat(seat);
      if (state.turn === 1) setRestartRequested(false);
      setState(state);
    });

    onEvent(Events.InvalidTurn, ({ state, error }) => {
      setState(state);
    });

    onEvent(Events.JoinedAsSpectator, ({ state }) => {
      setIsSpectator(true);
      if (state) setState(state);
      else restart();
    });

    onEvent(Events.RejoinedGame, ({ state, seat }) => {
      setState(state);
      setPlayerSeat(seat);
    });

    onEvent(Events.RestartRequested, () => {
      setRestartRequested(true);
    });

    onEvent(Events.Error, d => console.log('Error!', d));

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
        emitEvent(Events.JoinLobby, { room, id: savedId });
      } else {
        emitEvent(Events.JoinLobby, { room, id: playerId });
      }
    } else {
      emitEvent(Events.CreateLobby);
    }
  }, [room]);

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const player = playerSeat as Player;
    const id = playerId as string;

    playTurn({ player, board, cell });
    emitEvent(Events.PlayTurn, {
      room,
      id,
      board,
      cell,
      dev: (window as any).dev,
    });
  };

  const restartGame = () => {
    emitEvent(Events.Restart, { id: playerId, room });
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    emitEvent(Events.Forfeit, { id: playerId, room });
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
        state={state}
        seat={playerSeat!}
        mode={headerMode}
        onPlayAgainConfirm={restartGame}
        restartRequested={restartRequested}
      />
      <RelativeBox>
        <Board seat={playerSeat} state={state} onValidTurn={onValidTurn} />
        <TurnList turnList={state.turnList} onRestart={forfeitGame} />
      </RelativeBox>
    </>
  );
};

export default OnlineGame;
