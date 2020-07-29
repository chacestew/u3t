import socketIO = require('socket.io');

import { Events } from '../shared/types';
import { connections, lobbies } from './entities';
import { BadRequestError, NotFoundError, SocketError } from './errors';
import { Server } from 'http';
import { createLobby, joinLobby, playTurn, requestRestart, disconnect } from './handlers';
import Cron from './cron';

const io = socketIO();
export const cron = new Cron(1000 * 60 * 20);

const errorHandler = (
  err: BadRequestError | NotFoundError | SocketError,
  socket: socketIO.Socket
) => {
  console.error('[errorHandler]:', err);
  switch (err.code) {
    case 401: {
      return socket.error(err);
    }
    default: {
      return socket.error(err);
    }
  }
};

io.on('connection', socket => {
  connections.add(socket.id);
  console.log('Hello ', socket.id);

  socket.on(Events.CreateLobby, () =>
    createLobby(socket).catch(error => errorHandler(error, socket))
  );

  socket.on(Events.JoinLobby, data =>
    joinLobby(data, socket, io).catch(error => errorHandler(error, socket))
  );

  socket.on(Events.PlayTurn, data =>
    playTurn(data, socket, io).catch(error => errorHandler(error, socket))
  );

  socket.on(Events.Restart, data =>
    requestRestart(data, socket, io).catch(error => errorHandler(error, socket))
  );

  socket.on(Events.Disconnect, () =>
    disconnect(socket).catch(error => errorHandler(error, socket))
  );
});

export default (server: Server) => {
  io.attach(server);
  return () => ({ connections, lobbies });
};
