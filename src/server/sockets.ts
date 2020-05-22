import socketIO = require('socket.io');

import { Events } from '../shared/types';
import { createLobby, getGameById } from './entities';
import { JoinLobby, PlayTurn, Reconnect } from './handlers';
import { BadRequestError, NotAuthenticatedError } from './errors';
import { Server } from 'http';

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
  socket.on(Events.CreateLobby, () => {
    const id = createLobby();
    socket.emit(Events.LobbyReady, { id });
  });

  socket.on(Events.JoinLobby, data =>
    JoinLobby(data, socket, io).catch((e: string) => {})
  );

  socket.on(Events.RejoinGame, data =>
    Reconnect(data, socket, io).catch(e => console.error(e))
  );

  socket.on(Events.PlayTurn, data => {
    PlayTurn(data, socket, io).catch(err => errorHandler(err, socket));
  });

  socket.on(Events.Restart, data => {
    const { room, game } = getGameById(data.playerId);

    if (!game || !room) return;

    if (game.restartRequested) {
      const id = createLobby();
      io.to(room).emit(Events.LobbyReady, { id });
    } else {
      game.restartRequested = true;
    }
  });

  socket.on('disconnect', () => {
    console.log('disconnected from GAME!', socket.id);
  });
});

export default (server: Server) => {
  io.attach(server);
};
