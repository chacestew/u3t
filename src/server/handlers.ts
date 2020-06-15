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
  connections,
  getGameById,
  getGameByRoom,
} from './entities';

export const JoinLobby = async (
  data: EventParams[Events.JoinLobby],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const { room } = data;
  const { game } = getGameByRoom(room);

  socket.join(room, err => {
    if (err) throw new Error(err);
    const id = createId(4);

    game.addPlayer(socket.id, id);
    connections.set(id, room);

    if (game.status === Status.Started) {
      const state = game.gameState;
      const players = game.players;
      io.to(players[0].socket).emit(Events.StartGame, {
        seat: 1,
        id: players[0].id,
        state,
      });
      io.to(players[1].socket).emit(Events.StartGame, {
        seat: 2,
        id: players[1].id,
        state,
      });
    }
  });
};

export const Reconnect = async (
  data: any,
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const { room, game } = getGameById(data.id);

  socket.join(room, err => {
    if (err) throw new Error(err);
    socket.emit(Events.RejoinedGame, {
      seat: game.players.findIndex(e => e.id === data.id) + 1,
      state: game.gameState,
    });
  });
};

export const PlayTurn = async (
  data: EventParams[Events.PlayTurn],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const { room, game } = getGameById(data.id);

  const payload = {
    id: socket.id,
    player: data.player,
    board: data.board,
    cell: data.cell,
  };

  const nextState = await game.playTurn(payload);

  if (nextState.error) {
    socket.emit(Events.InvalidTurn, {
      state: game.gameState,
      error: nextState.error,
    });
  } else {
    io.to(room).emit(Events.Sync, {
      state: nextState.state,
    });
  }
};