import socketIO = require('socket.io');

import { Events, Emit } from '../../shared/types';
import { lobbies, Lobby } from '../entities';
import { SocketError } from '../errors';

const joinSpectator = (socket: socketIO.Socket, lobby: Lobby) => {
  const state = lobby.hasGame() ? lobby.getGame().gameState : null;
  socket.emit(Events.JoinedAsSpectator, { state });
};

const joinPlayer = (socket: socketIO.Socket, lobby: Lobby, id?: string) => {
  if (id) {
    const game = lobby.getGame();
    (socket.emit as Emit)(Events.RejoinedGame, {
      seat: game.getSeat(id),
      state: game.gameState,
    });
    return;
  }
  // On first join, create a new player with this socket
  return lobby.addPlayer(socket.id);
};

const startGame = (lobby: Lobby, io: socketIO.Server) => {
  const game = lobby.initGame();
  lobby.players.forEach(id => {
    io.to(id).emit(Events.StartGame, {
      seat: game.getSeat(id),
      id,
      state: game.gameState,
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
  if (!id && lobby.players.size >= 2) {
    return joinSpectator(socket, lobby);
  }

  // Handle player connection
  const playerId = joinPlayer(socket, lobby, id);

  if (playerId) {
    socket.join(playerId);
    socket.emit(Events.JoinedLobby, { id: playerId });
  }

  // Start when second player joined
  if (lobby.players.size !== 2) return;
  startGame(lobby, io);
}

export default joinLobby;
