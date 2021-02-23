import React, { useState, useEffect } from 'react';

import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import { RouteComponentProps } from 'react-router-dom';
import {
  Events,
  Player,
  Board as BoardType,
  Board as CellType,
  ErrorParams,
} from '../../shared/types';

import useGameReducer from '../../hooks/useGameReducer';
import LobbyHeader from './LobbyHeader';
import useSocket from '../../hooks/useSocket';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';
import useMultiplerState from '../../hooks/useLobbyReducer';
import { Reconnecting } from './Reconnecting';
import useNavigatorOnline from '../../hooks/useNavigatorOnline';
import ErrorModal from '../../Components/ErrorModal';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OnlineGame = ({
  history,
  match,
  spectator,
}: RouteComponentProps<{ room: string }> & { spectator?: boolean }) => {
  const [state, { playTurn, setState, restart }] = useGameReducer();
  const [error, setError] = useState<ErrorParams | null>(null);
  const isNavigatorOnline = useNavigatorOnline();
  const [socketConnectionLost, setSocketConnectionLost] = useState(false);
  const hasLostConnection = !isNavigatorOnline || socketConnectionLost;

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
    lobbyStateRef,
  } = useMultiplerState({ isSpectator: !!spectator });

  const { socket, onEvent, emitEvent } = useSocket();

  // uwc-debug
  useEffect(() => {
    socket.open();

    onEvent(Events.LobbyReady, (data) => {
      onLobbyReady(data);
      history.replace(`/game/${data.room}`);
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

    onEvent(Events.InvalidTurn, ({ state }) => {
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

    socket.io.on(Events.Reconnect, () => {
      setSocketConnectionLost(false);
      console.log('emitting...', {
        id: lobbyStateRef.current.playerId,
        room: lobbyStateRef.current.roomId,
      });
      emitEvent(Events.Sync, {
        id: lobbyStateRef.current.playerId,
        room: lobbyStateRef.current.roomId,
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
    lobbyStateRef,
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
        emitEvent(Events.JoinLobby, {
          room: match.params.room,
          spectator: lobbyState.isSpectator,
        });
      }
    }
  }, [emitEvent, lobbyState.isSpectator, match.params.room, match.path, reset, set]);

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
    emitEvent(Events.Restart, {
      id: lobbyState.playerId!,
      room: lobbyState.roomId!,
    });
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    emitEvent(Events.Forfeit, {
      id: lobbyState.playerId!,
      room: lobbyState.roomId!,
    });
  };

  return (
    <>
      <LobbyHeader
        state={state}
        lobbyState={lobbyState}
        seat={lobbyState.playerSeat!}
        onPlayAgainConfirm={restartGame}
        restartRequested={lobbyState.restartRequested}
      />
      <RelativeBox>
        <Board
          Alert={hasLostConnection && <Reconnecting />}
          Modal={error && <ErrorModal />}
          seat={lobbyState.playerSeat}
          state={state}
          onValidTurn={onValidTurn}
          disabled={hasLostConnection}
        />
        {state && (
          <TurnList
            lobbyState={lobbyState}
            state={state}
            RestartButton={
              <RestartButton
                onClick={forfeitGame}
                text="Forfeit"
                icon={
                  <FontAwesomeIcon
                    color="white"
                    stroke="#594b5c"
                    strokeWidth="50"
                    icon={faFlag}
                  />
                }
              />
            }
          />
        )}
      </RelativeBox>
    </>
  );
};

export default OnlineGame;
