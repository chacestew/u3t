import socketIO = require('socket.io');

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function RequestRestart(
  data: EventParams[Events.Restart],
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const lobby = lobbies.getByPlayer(data.id);

  const twoRequestsReceived = lobby.requestRestart(data.id, socket.id);

  const game = lobby.getGame();

  if (twoRequestsReceived || data.forfeit) {
    const nextLobby = lobbies.create();

    game.restart();

    return io.to(lobby.id).emit(Events.Sync, { state: game.gameState });

    for (const [_, socket] of lobby.restartRequests) {
      const id = nextLobby.addPlayer(socket);
      io.to(socket).emit(Events.LobbyReady, { room: nextLobby.id, id });
    }

    io.to(lobby.id).emit(Events.LobbyReady, { room: nextLobby.id });

    // Handle lobby finished here
  } else {
    io.to(lobby.id).emit(Events.RestartRequested);
  }
}

export default RequestRestart;
