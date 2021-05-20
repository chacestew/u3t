import React, { useState, useEffect } from 'react';
import { StaticContext } from 'react-router';

import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import { RouteComponentProps } from 'react-router-dom';
import {
  Events,
  Player,
  Board as BoardType,
  Board as CellType,
  ErrorParams,
  GameStarted,
  Sync,
  Errors,
  ResyncArgs,
  JoinLobbyRequestArgs,
  RestartRequestArgs,
  ForfeitRequestArgs,
  JoinLobbyResponses,
  PlayTurnRequestArgs,
} from '../../shared/types2/types';

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
import { Socket } from 'socket.io-client';

const OnlineGame = ({
  history,
  match,
  location,
  spectator,
  socket,
}: // socket,
RouteComponentProps<{ room: string }, StaticContext, { playerId?: string }> & {
  spectator?: boolean;
  socket: Socket;
}) => {
  const [state, { playTurn, setState, restart }] = useGameReducer();
  const [error, setError] = useState<ErrorParams | null>(null);
  const isNavigatorOnline = useNavigatorOnline();
  const [socketConnectionLost, setSocketConnectionLost] = useState(false);
  const hasLostConnection = !isNavigatorOnline || socketConnectionLost;

  const {
    lobbyState,
    dispatchers: {
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

  // const { socket, onEvent, emitEvent } = useSocket();

  // uwc-*debug
  useEffect(() => {
    if (!socket.connected) socket.open();

    // onEvent(Events.LobbyReady, (data) => {
    //   onLobbyReady(data);
    //   history.replace(`/game/${data.room}`);
    // });

    socket.on(Events.GameStarted, (data: GameStarted) => {
      console.log('received game started', data);
      sessionStorage.setItem(data.lobbyId, data.playerId);
      onStartGame(data);
      setState(data.state);
    });

    // onEvent(Events.StartGame, (data) => {
    //   sessionStorage.setItem(data.lobbyId, data.playerId);
    //   onStartGame(data);
    //   setState(data.state);
    // });

    // onEvent(Events.JoinedLobby, (data) => {
    //   onJoinedLobby(data);
    // });

    socket.on(Events.Sync, (data: Sync) => {
      onSync(data);
      setState(data.state);
    });

    // onEvent(Events.Sync, (data) => {
    //   onSync(data);
    //   setState(data.state);
    // });

    // onEvent(Events.InvalidTurn, ({ state }) => {
    //   setState(state);
    // });

    // onEvent(Events.JoinedAsSpectator, (data) => {
    //   onJoinedAsSpectator(data);
    //   if (data.state) {
    //     setState(data.state);
    //   } else restart();
    // });

    // onEvent(Events.RejoinedGame, (data) => {
    //   onRejoinedGame(data);
    //   setState(data.state);
    // });

    socket.on(Events.RestartRequested, () => {
      onRestartRequested();
    });

    // onEvent(Events.RestartRequested, (data) => {
    //   onRestartRequested(data);
    // });

    socket.on(Events.Error, (error) => setError(error));

    // onEvent(Events.Error, (error) => {
    //   setError(error);
    // });

    socket.on(Events.Disconnect, () => setSocketConnectionLost(true));

    // onEvent(Events.Disconnect, () => {
    //   setSocketConnectionLost(true);
    // });

    socket.io.on('reconnect', () => {
      setSocketConnectionLost(false);
      socket.emit(Events.Resync, {
        playerId: lobbyStateRef.current.playerId,
        lobbyId: lobbyStateRef.current.roomId,
      } as ResyncArgs);
    });

    return () => {
      console.log('Closing socket');
      socket.io.off();
      socket.off();
      socket.close();
    };
  }, [
    // emitEvent,
    lobbyStateRef,
    // onEvent,
    socket,
    onJoinedAsSpectator,
    onJoinedLobby,
    // onLobbyReady,
    onRejoinedGame,
    onRestartRequested,
    onStartGame,
    onSync,
    restart,
    setError,
    setState,
    history,
  ]);

  useEffect(
    () => {
      console.log('useEffect for joinlobby called');
      const playerId = location.state?.playerId || undefined; // sessionStorage.getItem(match.params.room)
      const lobbyId = location.state?.lobbyId || match.params.room;
      set({ playerId, roomId: lobbyId });
      console.log({ playerId, lobbyId });
      if (playerId) return;
      socket.emit(
        Events.JoinLobby,
        {
          lobbyId,
          playerId,
          spectator: lobbyState.isSpectator,
        } as JoinLobbyRequestArgs,
        (data: JoinLobbyResponses) => {
          console.log('got join lobby response', data);
          switch (data.role) {
            case 'new-player':
              onJoinedLobby(data);
              break;
            case 'reconnected-player':
              onRejoinedGame(data);
              break;
            case 'spectator':
              onJoinedAsSpectator(data);
          }
        }
      );
      // emitEvent(Events.JoinLobby, {
      //   lobbyId: match.params.room,
      //   playerId,
      //   spectator: lobbyState.isSpectator,
      // });
    },
    [
      // emitEvent,
      // lobbyState.isSpectator,
      // location.state,
      // match.params.room,
      // match.path,
      // onJoinedAsSpectator,
      // onJoinedLobby,
      // onRejoinedGame,
      // reset,
      // set,
      // socket,
    ]
  );

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const player = lobbyState.playerSeat as Player;
    const id = lobbyState.playerId as string;
    const room = lobbyState.roomId as string;
    console.log('onvalidturn data', {
      lobbyId: room,
      playerId: id,
      board,
      cell,
      dev: (window as any).dev,
    });

    playTurn({ player, board, cell });
    socket.emit(
      Events.PlayTurn,
      {
        lobbyId: room,
        playerId: id,
        board,
        cell,
        dev: (window as any).dev,
      } as PlayTurnRequestArgs,
      (res) => {}
    );
    // emitEvent(Events.PlayTurn, {
    //   room,
    //   id,
    //   board,
    //   cell,
    //   dev: (window as any).dev,
    // });
  };

  const restartGame = () => {
    socket.emit(Events.Restart, {
      playerId: lobbyState.playerId,
      lobbyId: lobbyState.roomId,
    } as RestartRequestArgs);
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    socket.emit(Events.Forfeit, {
      playerId: lobbyState.playerId,
      lobbyId: lobbyState.roomId,
    } as ForfeitRequestArgs);
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
