import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import {
  Events,
  SocketCallback,
  CreateLobbyResponse,
  JoinLobbyResponses,
  JoinLobbyRequestArgs,
  PlayTurnResponse,
  RestartRequestArgs,
  ForfeitRequestArgs,
  ResyncArgs,
} from './shared/types2/types';
import { lobbies } from './entities';
import { BadRequestError, NotFoundError, SocketError } from './errors';
import {
  createLobby,
  joinLobby,
  playTurn,
  requestRestart,
  disconnect,
  forfeit,
  resync,
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

const joinRooms = (data: { lobbyId?: string; playerId?: string }, socket: Socket) => {
  if (data.lobbyId) socket.join(data.lobbyId);
  if (data.playerId) socket.join(data.playerId);
};

io.on('connection', (socket: Socket) => {
  console.log('Hello ', socket.id);

  socket.on(Events.CreateLobby, (cb: SocketCallback<CreateLobbyResponse>) => {
    logger.info(`CreateLobby`);
    createLobby(socket, cb).catch((error) => errorHandler(error, socket));
  });

  socket.on(
    Events.JoinLobby,
    (data: JoinLobbyRequestArgs, cb: SocketCallback<JoinLobbyResponses>) => {
      logger.info(`JoinLobby`, { data });
      joinRooms(data, socket);
      joinLobby(socket, io, data, cb).catch((error) => errorHandler(error, socket));
    }
  );

  socket.on(Events.PlayTurn, (data, cb: SocketCallback<PlayTurnResponse>) => {
    logger.info(`PlayTurn`, { data });
    joinRooms(data, socket);
    playTurn(data, io, cb).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Restart, (data: RestartRequestArgs) => {
    logger.info(`Restart`, { data });
    joinRooms(data, socket);
    requestRestart(data, socket, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Forfeit, (data: ForfeitRequestArgs) => {
    logger.info(`Forfeit`, { data });
    joinRooms(data, socket);
    forfeit(data, io).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Disconnect, () => {
    logger.info(`Disconnect`);
    disconnect(socket).catch((error) => errorHandler(error, socket));
  });

  socket.on(Events.Resync, (data: ResyncArgs) => {
    logger.info('Reconnect', { data });
    resync(data, socket).catch((error) => errorHandler(error, socket));
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
