import React, { useState, useEffect, useReducer } from 'react';

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
  // const [playerId, setPlayerId] = useState('');
  // const [playerSeat, setPlayerSeat] = useState<Player | null>(null);
  // const [isSpectator, setIsSpectator] = useState(false);
  // const [restartRequested, setRestartRequested] = useState(false);
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

  useEffect(() => {
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
    });

    return () => {
      console.log('Closing socket');
      socket.close();
    };
  }, []);

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
    const player = lobbyState.playerSeat as Player;
    const id = lobbyState.playerId as string;
    const room = lobbyState.roomId as string;

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
    emitEvent(Events.Restart, { id: lobbyState.playerId!, room: lobbyState.roomId! });
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    emitEvent(Events.Forfeit, { id: lobbyState.playerId!, room: lobbyState.roomId! });
  };

  const headerMode = lobbyState.isSpectator
    ? 'spectator'
    : lobbyState.roomId && !lobbyState.playerSeat
    ? 'share'
    : lobbyState.playerSeat
    ? 'online'
    : 'loading';

  console.log(lobbyState);

  return (
    <>
      <Header
        room={lobbyState.roomId!}
        state={state}
        seat={lobbyState.playerSeat!}
        mode={headerMode}
        onPlayAgainConfirm={restartGame}
        restartRequested={lobbyState.restartRequested}
      />
      <RelativeBox>
        <Board
          Alert={hasLostConnection && <Reconnecting />}
          seat={lobbyState.playerSeat}
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
