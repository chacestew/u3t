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
  ErrorParams,
} from '../../shared/types';

import useGameReducer from '../../hooks/useGameReducer';
import { Header } from '../../Components/GameArea/Header/Header';
import useSocket from '../../hooks/useSocket';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';
import useMultiplerState from '../../hooks/useLobbyReducer';
import { Reconnecting } from './Reconnecting';
import useNavigatorOnline from '../../hooks/useNavigatorOnline';

const useErrorManager = () => {
  const [error, setError] = useState<ErrorParams | null>(null);

  const dismissError = () => setError(null);

  return { error, setError, dismissError };
};

const OnlineGame = ({ history, match }: RouteComponentProps<{ room: string }>) => {
  const [state, { playTurn, setState, restart }] = useGameReducer();
  const { error, setError, dismissError } = useErrorManager();
  const isNavigatorOnline = useNavigatorOnline();
  const [socketConnectionLost, setSocketConnectionLost] = useState(false);
  const hasLostConnection = !isNavigatorOnline || socketConnectionLost;
  // const [room, setRoom] = useState('');
  const {
    lobbyState,
    dispatchers: {
      onLobbyReady,
      onStartGame,
      onJoinedAsSpectator,
      onJoinedLobby,
      onRejoinedGame,
      onRestartRequested,
      onSync,
      set,
      reset,
    },
  } = useMultiplerState();

  const { socket, onEvent, emitEvent } = useSocket();

  // uwc-debug
  useEffect(() => {
    socket.open();

    onEvent(Events.LobbyReady, (data) => {
      onLobbyReady(data);
      history.replace(`/play/${data.room}`);
    });

    onEvent(Events.StartGame, (data) => {
      sessionStorage.setItem(data.room, data.id);
      onStartGame(data);
      setState(data.state);
    });

    onEvent(Events.JoinedLobby, (data) => {
      onJoinedLobby(data);
    });

    onEvent(Events.Sync, (data) => {
      onSync(data);
      setState(data.state);
    });

    onEvent(Events.InvalidTurn, ({ state, error }) => {
      setState(state);
    });

    onEvent(Events.JoinedAsSpectator, (data) => {
      onJoinedAsSpectator(data);
      if (data.state) {
        setState(data.state);
      } else restart();
    });

    onEvent(Events.RejoinedGame, (data) => {
      onRejoinedGame(data);
      setState(data.state);
    });

    onEvent(Events.RestartRequested, (data) => {
      onRestartRequested(data);
    });

    onEvent(Events.Error, (error) => {
      setError(error);
    });

    onEvent(Events.Disconnect, () => {
      setSocketConnectionLost(true);
    });

    socket.io.on('reconnect', () => {
      setSocketConnectionLost(false);
      console.log('emitting...', {
        id: lobbyState.current.playerId,
        room: lobbyState.current.roomId,
      });
      emitEvent(Events.Sync, {
        id: lobbyState.current.playerId,
        room: lobbyState.current.roomId,
      } as any);
    });

    return () => {
      console.log('Closing socket');
      socket.io.off();
      socket.off();
      socket.close();
    };
  }, [
    emitEvent,
    lobbyState,
    onEvent,
    socket,
    onJoinedAsSpectator,
    onJoinedLobby,
    onLobbyReady,
    onRejoinedGame,
    onRestartRequested,
    onStartGame,
    onSync,
    restart,
    setError,
    setState,
    history,
  ]);

  useEffect(() => {
    if (!match.params.room) {
      reset();
      emitEvent(Events.CreateLobby);
    } else {
      const savedId = sessionStorage.getItem(match.params.room);
      if (savedId) {
        set({ playerId: savedId });
        emitEvent(Events.JoinLobby, { room: match.params.room, id: savedId });
      } else {
        emitEvent(Events.JoinLobby, { room: match.params.room });
      }
    }
  }, [match.params.room]);

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const player = lobbyState.current.playerSeat as Player;
    const id = lobbyState.current.playerId as string;
    const room = lobbyState.current.roomId as string;

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
    emitEvent(Events.Restart, {
      id: lobbyState.current.playerId!,
      room: lobbyState.current.roomId!,
    });
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    emitEvent(Events.Forfeit, {
      id: lobbyState.current.playerId!,
      room: lobbyState.current.roomId!,
    });
  };

  const headerMode = lobbyState.current.isSpectator
    ? 'spectator'
    : lobbyState.current.roomId && !lobbyState.current.playerSeat
    ? 'share'
    : lobbyState.current.playerSeat
    ? 'online'
    : 'loading';

  console.log(lobbyState.current);

  return (
    <>
      <Header
        room={lobbyState.current.roomId!}
        state={state}
        seat={lobbyState.current.playerSeat!}
        mode={headerMode}
        onPlayAgainConfirm={restartGame}
        restartRequested={lobbyState.current.restartRequested}
      />
      <RelativeBox>
        <Board
          Alert={hasLostConnection && <Reconnecting />}
          seat={lobbyState.current.playerSeat}
          state={state}
          onValidTurn={onValidTurn}
          error={error}
          dismissError={dismissError}
          disabled={hasLostConnection}
        />
        <TurnList turnList={state.turnList} onRestart={forfeitGame} />
      </RelativeBox>
    </>
  );
};

export default OnlineGame;
