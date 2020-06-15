import nanoid = require('nanoid/generate');
import socketIO = require('socket.io');
import Game, { Status } from './Game';
import { Application } from 'express';

import io from './sockets';
import { Events, EventParams } from '../shared/types';
import {
  createLobby,
  games,
  createId,
  playersToRooms,
  getGameById,
  getGameByRoom,
  socketsToPlayers,
  Lobbies,
} from './entities';
import game from '../shared/game';

export const CreateLobby = async (socket: socketIO.Socket) => {
  const { id } = Lobbies.create();
  socket.emit(Events.LobbyReady, { id });
};

export const JoinLobby = async (
  data: EventParams[Events.JoinLobby],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const lobby = Lobbies.get(data.room);
  console.log('called');
  socket.join(lobby.id, err => {
    if (err) throw new Error(err);
    console.log('someone joined');
    if (lobby.players.size >= 2) {
      console.log('spec joined');
      const state = lobby.getGame().gameState;
      return socket.emit(Events.JoinedAsSpectator, { state });
    }

    const id = lobby.addPlayer(socket.id);
    if (lobby.players.size < 2) return;

    lobby.initGame();

    const game = lobby.game!;

    game.seats.forEach((id, seat) => {
      const sockets = lobby.players.get(id)!;
      console.log('emitting game inits', { id, seat, sockets });
      io.to(sockets[sockets.length - 1]).emit(Events.StartGame, {
        seat: seat + 1,
        id,
        state: game.gameState,
      });
    });
  });
};

export const Reconnect = async (
  data: EventParams[Events.RejoinGame],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const lobby = Lobbies.getByPlayer(data.id);

  socket.join(lobby.id, err => {
    lobby.players.get(data.id).push(socket.id);
    socket.emit(Events.RejoinGame, {
      seat: lobby.game!.seats.indexOf(data.id),
      state: lobby.game!.gameState,
    });
  });
};

export const PlayTurn = async (
  data: EventParams[Events.PlayTurn],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const lobby = Lobbies.getByPlayer(data.id);
  const game = lobby.getGame();

  const payload = {
    player: data.player,
    board: data.board,
    cell: data.cell,
  };

  const { state, error } = await game.playTurn(payload);

  if (process.env.NODE_ENV === 'development' && data.dev === true) {
    game.instantEnd();
  }

  if (error) {
    socket.emit(Events.InvalidTurn, {
      state: game.gameState,
      error: error,
    });
  } else {
    io.to(lobby.id).emit(Events.Sync, {
      state: game.gameState,
    });
  }

  if (state.finished) {
    // Handle game finished here
  }
};

export const RequestRestart = async (
  data: EventParams[Events.Restart],
  io: socketIO.Server
) => {
  const lobby = Lobbies.getByPlayer(data.id);

  const twoRequestsReceived = lobby.requestRestart(data.id);

  if (twoRequestsReceived) {
    const { id } = Lobbies.create();
    io.to(lobby.id).emit(Events.LobbyReady, { id });

    // Handle lobby finished here
  } else {
    io.to(lobby.id).emit(Events.RestartRequested);
  }
};

export const Disconnected = async (socket: socketIO.Socket) => {
  socketsToPlayers.delete(socket.id);
};
