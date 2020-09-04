import socketIO = require('socket.io');

import { Events, Emit } from '../../shared/types';
import { lobbies, Lobby } from '../entities';
import { SocketError } from '../errors';
import logger from '../logger';

const joinSpectator = (socket: socketIO.Socket, lobby: Lobby) => {
  logger.info('Joining player as spectator', { data: { lobby: lobby.id } });
  const state = lobby.getGame().getState();
  socket.emit(Events.JoinedAsSpectator, { state });
};

const joinPlayer = (socket: socketIO.Socket, lobby: Lobby, id?: string) => {
  if (id) {
    logger.info('Rejoining player to lobby', { data: { lobby: lobby.id, player: id } });
    const game = lobby.getGame();
    (socket.emit as Emit)(Events.RejoinedGame, {
      room: lobby.id,
      seat: game.getSeat(id),
      state: game.getState(),
    });
    return;
  }

  // On first join, create a new player with this socket
  logger.info('Joining new player to lobby', { data: { lobby: lobby.id } });
  return lobby.addPlayer(socket.id);
};

const startGame = (lobby: Lobby, io: socketIO.Server) => {
  const game = lobby.initGame();
  lobby.players.forEach((id) => {
    io.to(id).emit(Events.StartGame, {
      room: lobby.id,
      seat: game.getSeat(id),
      id,
      state: game.getState(),
    });
  });
};

async function joinLobby(
  data: { room: string; id?: string },
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const { room, id } = data;
  const lobby = lobbies.get(room);

  // Handle spectator connection
  if (!id && lobby.hasGame()) {
    joinSpectator(socket, lobby);
    return;
  }

  // Handle player connection
  const playerId = joinPlayer(socket, lobby, id);

  if (playerId) {
    socket.join(playerId);
    socket.emit(Events.JoinedLobby, { id: playerId, room: lobby.id });
  }

  // Start when second player joined
  if (lobby.players.size === 2) {
    startGame(lobby, io);
  }
}

export default joinLobby;
