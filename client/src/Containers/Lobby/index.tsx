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
  PlayTurnResponse,
} from '@u3t/common';

import useGameReducer from '../../hooks/useGameReducer';
import LobbyHeader from './LobbyHeader';
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
RouteComponentProps<
  { lobbyId: string },
  StaticContext,
  { playerId?: string; lobbyId?: string }
> & {
  spectator?: boolean;
  socket: Socket;
}) => {
  const [state, { playTurn, setState, restart }] = useGameReducer();
  const [error, setError] = useState<ErrorParams | null>(null);
  const isNavigatorOnline = useNavigatorOnline();
  const [socketConnectionLost, setSocketConnectionLost] = useState(false);
  const hasLostConnection = !isNavigatorOnline || socketConnectionLost;

  const { lobbyState, lobbyStateRef, dispatch } = useMultiplerState({
    isSpectator: !!spectator,
  });

  // uwc-*debug
  useEffect(() => {
    if (!socket.connected) socket.open();

    socket.on(Events.GameStarted, (data: GameStarted) => {
      console.log('received game started', data);
      sessionStorage.setItem(data.lobbyId, data.playerId);
      dispatch({ event: Events.GameStarted, data });
      setState(data.state);
    });

    socket.on(Events.Sync, (data: Sync) => {
      dispatch({ event: Events.Sync, data });
      setState(data.state);
    });

    socket.on(Events.RestartRequested, () => {
      dispatch({ event: Events.RestartRequested });
    });

    socket.on(Events.Error, (error) => setError(error));

    socket.on(Events.Disconnect, () => setSocketConnectionLost(true));

    socket.io.on('reconnect', () => {
      setSocketConnectionLost(false);
      socket.emit(Events.Resync, {
        playerId: lobbyStateRef.current.playerId,
        lobbyId: lobbyStateRef.current.lobbyId,
      } as ResyncArgs);
    });

    return () => {
      console.log('Closing socket');
      socket.io.off();
      socket.off();
      socket.close();
    };
  }, [lobbyStateRef, socket, restart, setError, setState, history, dispatch]);

  useEffect(() => {
    console.log('useEffect for joinlobby called');
    const playerId = location.state?.playerId; // sessionStorage.getItem(match.params.lobbyId)
    const lobbyId = location.state?.lobbyId || match.params.lobbyId;
    dispatch({ event: 'set', data: { playerId, lobbyId } });
    if (playerId) return;
    socket.emit(
      Events.JoinLobby,
      {
        lobbyId,
        playerId,
        spectator: lobbyState.isSpectator,
      } as JoinLobbyRequestArgs,
      (data: JoinLobbyResponses) => {
        switch (data.role) {
          case 'new-player':
            dispatch({ event: Events.JoinedLobby, data });
            break;
          case 'reconnected-player':
            dispatch({ event: Events.RejoinedGame, data });
            break;
          case 'spectator':
            dispatch({ event: Events.JoinedAsSpectator, data });
        }
      }
    );
  }, []);

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const { playerSeat, playerId, lobbyId } = lobbyState;
    const player = playerSeat as Player;

    playTurn({ player, board, cell });
    socket.emit(
      Events.PlayTurn,
      {
        lobbyId,
        playerId,
        board,
        cell,
        dev: (window as any).dev,
      } as PlayTurnRequestArgs,
      (res: PlayTurnResponse) => {
        if (!res.valid) {
          // Undo the turn here
          // Display res.error somehow
        }
      }
    );
  };

  const restartGame = () => {
    socket.emit(Events.Restart, {
      playerId: lobbyState.playerId,
      lobbyId: lobbyState.lobbyId,
    } as RestartRequestArgs);
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    socket.emit(Events.Forfeit, {
      playerId: lobbyState.playerId,
      lobbyId: lobbyState.lobbyId,
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
