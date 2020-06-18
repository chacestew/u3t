import socketIO = require('socket.io');

import { Events, Emit } from '../../shared/types';
import { lobbies, Lobby, connections } from '../entities';

const joinSpectator = (socket: socketIO.Socket, lobby: Lobby) => {
  const state = lobby.game ? lobby.getGame().gameState : null;
  socket.emit(Events.JoinedAsSpectator, { state });
};

const joinPlayer = (socket: socketIO.Socket, lobby: Lobby, id?: string) => {
  if (id) {
    // If an exisiting player, link this socket
    lobby.getPlayer(id).sockets.add(socket.id);
    connections.get(socket.id).setPlayer(id);
    connections.get(socket.id).setLobby(lobby.id);

    // If game is ongoing (rejoin), rpro
    if (lobby.game) {
      (socket.emit as Emit)(Events.RejoinedGame, {
        seat: lobby.game.seats.indexOf(id) as 1 | 2,
        state: lobby.game.gameState,
      });
    }

    return;
  }
  // On first join, create a new player with this socket
  const player = lobby.addPlayer(socket.id);
  connections.get(socket.id).setPlayer(player);
  connections.get(socket.id).setLobby(lobby.id);
};

const startGame = (lobby: Lobby, io: socketIO.Server) => {
  const game = lobby.initGame();

  game.seats.forEach((id, seat) => {
    const { sockets } = lobby.getPlayer(id);
    for (const socket of sockets) {
      io.to(socket).emit(Events.StartGame, {
        seat: seat + 1,
        id,
        state: game.gameState,
      });
    }
  });
};

async function joinLobby(
  data: { room: string; id?: string },
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const { room, id } = data;
  const lobby = lobbies.get(room);

  socket.join(lobby.id, err => {
    if (err) throw new Error(err);

    // Handle spectator connection
    if (!id && lobby.players.size >= 2) {
      return joinSpectator(socket, lobby);
    }

    // Handle player connection
    joinPlayer(socket, lobby, id);

    // Start when second player joined
    if (lobby.players.size !== 2) return;
    startGame(lobby, io);
  });
}

export default joinLobby;
