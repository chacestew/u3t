import { instrument } from '@socket.io/admin-ui';
import {
  ClientToServerEvents,
  Events,
  IdFields,
  ServerToClientEvents,
} from '@u3t/common';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

import { BadRequestError, NotFoundError } from './errors';
import {
  createLobby,
  forfeit,
  joinLobby,
  playTurn,
  requestRestart,
  resync,
} from './handlers';
import logger from './logger';

const io = new Server<ClientToServerEvents, ServerToClientEvents>();

const errorHandler = (err: Error | BadRequestError | NotFoundError, socket: Socket) => {
  if (err instanceof NotFoundError) {
    socket.emit('error', { code: 'not-found' });
    logger.error(err.message, err.data);
  } else {
    logger.error(err.message);
  }
};

const joinRooms = (data: Partial<IdFields>, socket: Socket) => {
  if (!data) return;
  if (data.lobbyId) socket.join(data.lobbyId);
  if (data.playerId) socket.join(data.playerId);
};

io.on('connection', (socket) => {
  logger.info('New connection', { socket: socket.id });

  if (process.env.NODE_ENV === 'development') {
    socket.use((socket, next) => {
      setTimeout(() => {
        next();
      }, 500);
    });
  }

  socket.use(([event, data], next) => {
    if (event !== 'disconnect' && event !== Events.CreateLobby) {
      joinRooms(data, socket);
    }
    next();
  });

  socket.on(Events.CreateLobby, (cb) => {
    logger.info(`CreateLobby`, { socket: socket.id });

    createLobby(cb)
      .then((data) => joinRooms(data, socket))
      .catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.JoinLobby, (data, cb) => {
    logger.info(`JoinLobby`, { socket: socket.id, ...data });

    joinLobby(socket, io, data, cb).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.PlayTurn, (data, cb) => {
    logger.info(`PlayTurn`, { socket: socket.id, ...data });

    playTurn(data, io, cb).catch((error) => {
      cb({ valid: false, error });
      errorHandler(error, socket);
    });
  });

  socket.on(Events.Restart, (data) => {
    logger.info(`RequestRestart`, { socket: socket.id, ...data });

    requestRestart(data, socket, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Forfeit, (data) => {
    logger.info(`Forfeit`, { socket: socket.id, ...data });

    forfeit(data, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Resync, (data) => {
    logger.info('Reconnect', { socket: socket.id, ...data });

    resync(data, socket).catch((error) => errorHandler(error, socket));
  });

  socket.on('disconnect', () => {
    logger.info('Closed connection', { socket: socket.id });
  });
});

export default function attachSockets(server: HttpServer) {
  const origin = ['https://admin.socket.io'];

  if (process.env.NODE_ENV === 'development') origin.push('http://localhost:8000');

  io.attach(server, {
    path: '/ws',
    cors: {
      origin,
      credentials: true,
    },
  });

  instrument(io, {
    auth: {
      type: 'basic',
      username: 'admin',
      password: '$2b$12$hVrCGry5JUgdA0Hu/I4kUugDkYSgMVIn7UjlbJi3yir6MttL3KZCa',
    },
  });
}
