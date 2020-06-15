import socketIO = require('socket.io');

import { Events } from '../shared/types';
import { createLobby, getGameById, Connections } from './entities';
import { JoinLobby, PlayTurn, Reconnect, RequestRestart, CreateLobby } from './handlers';
import { BadRequestError, NotAuthenticatedError } from './errors';
import { Server } from 'http';
import Cron from './cron';

const io = socketIO();

const errorHandler = (
  err: BadRequestError | NotAuthenticatedError,
  socket: socketIO.Socket
) => {
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
  Connections.add(socket.id);

  socket.on(Events.CreateLobby, data => CreateLobby(socket));

  socket.on(Events.JoinLobby, data =>
    JoinLobby(data, socket, io).catch(e => console.error(e))
  );

  socket.on(Events.RejoinGame, data =>
    Reconnect(data, socket, io).catch(e => console.error(e))
  );

  socket.on(Events.PlayTurn, data => {
    PlayTurn(data, socket, io).catch(err => errorHandler(err, socket));
  });

  socket.on(Events.Restart, data => {
    RequestRestart(data, io).catch(err => errorHandler(err, socket));
  });

  socket.on('disconnect', () => {
    Connections.remove(socket.id);
    console.log('disconnected from GAME!', socket.id);
  });
});

export default (server: Server) => {
  io.attach(server);
};
