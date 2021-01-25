import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Events } from './shared/types';
import { lobbies } from './entities';
import { BadRequestError, NotFoundError, SocketError } from './errors';
import {
  createLobby,
  joinLobby,
  playTurn,
  requestRestart,
  disconnect,
  forfeit,
  sync,
} from './handlers';
import logger from './logger';

const io = new Server();

const errorHandler = (
  err: BadRequestError | NotFoundError | SocketError,
  socket: Socket
) => {
  if (err instanceof NotFoundError) socket.emit('error', { code: 'not-found' });
  logger.error(err.message);
};

const joinRooms = (data: { id?: string; room?: string }, socket: Socket) => {
  if (data.room) socket.join(data.room);
  if (data.id) socket.join(data.id);
};

io.on('connection', (socket: Socket) => {
  console.log('Hello ', socket.id);

  socket.on(Events.CreateLobby, () => {
    logger.info(`CreateLobby`);
    createLobby(socket).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.JoinLobby, (data) => {
    logger.info(`JoinLobby`, { data });
    joinRooms(data, socket);
    joinLobby(data, socket, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.PlayTurn, (data) => {
    logger.info(`PlayTurn`, { data });
    joinRooms(data, socket);
    playTurn(data, socket, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Restart, (data) => {
    logger.info(`Restart`, { data });
    joinRooms(data, socket);
    requestRestart(data, socket, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Forfeit, (data) => {
    logger.info(`Forfeit`, { data });
    joinRooms(data, socket);
    forfeit(data, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Disconnect, () => {
    logger.info(`Disconnect`);
    disconnect(socket).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Sync, (data) => {
    logger.info('Reconnect', { data });
    sync(data, socket).catch((error) => errorHandler(error, socket));
  });
});

export default (server: HttpServer) => {
  io.attach(server, {
    path: '/ws',
    cors: {
      origin: 'http://localhost:8000',
      methods: ['GET', 'POST'],
    },
  });
  return () => ({ lobbies });
};
