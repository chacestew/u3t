import socketIO = require('socket.io');

import { Events } from '../shared/types';
import { lobbies } from './entities';
import { BadRequestError, NotFoundError, SocketError } from './errors';
import { Server } from 'http';
import {
  createLobby,
  joinLobby,
  playTurn,
  requestRestart,
  disconnect,
  forfeit,
} from './handlers';

const io = socketIO();

const errorHandler = (
  err: BadRequestError | NotFoundError | SocketError,
  socket: socketIO.Socket
) => {
  console.error('[errorHandler]:', err);
  if (err instanceof NotFoundError) socket.error({ code: 401 });

  // switch (err.code) {
  //   case 401: {
  //     return socket.error(err);
  //   }
  //   default: {
  //     return socket.error(err);
  //   }
  // }
};

const joinRooms = (data: { id?: string; room?: string }, socket: socketIO.Socket) => {
  if (data.room) socket.join(data.room);
  if (data.id) socket.join(data.id);
};

io.on('connection', socket => {
  console.log('Hello ', socket.id);

  socket.on(Events.CreateLobby, () => {
    createLobby(socket).catch(error => errorHandler(error, socket));
  });

  socket.on(Events.JoinLobby, data => {
    joinRooms(data, socket);
    joinLobby(data, socket, io).catch(error => errorHandler(error, socket));
  });

  socket.on(Events.PlayTurn, data => {
    joinRooms(data, socket);
    playTurn(data, socket, io).catch(error => errorHandler(error, socket));
  });

  socket.on(Events.Restart, data => {
    joinRooms(data, socket);
    requestRestart(data, socket, io).catch(error => errorHandler(error, socket));
  });

  socket.on(Events.Forfeit, data => {
    joinRooms(data, socket);
    forfeit(data, io).catch(error => errorHandler(error, socket));
  });

  socket.on(Events.Disconnect, () => {
    disconnect(socket).catch(error => errorHandler(error, socket));
  });
});

export default (server: Server) => {
  io.attach(server);
  return () => ({ lobbies });
};
