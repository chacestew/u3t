import socketIO = require('socket.io');

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function RequestRestart(
  data: EventParams[Events.Restart],
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const lobby = lobbies.get(data.room);

  const hasRestarted = lobby.requestRestart(data.id, socket.id);

  if (!hasRestarted) return io.to(lobby.id).emit(Events.RestartRequested);

  const game = lobby.getGame();

  // Send the game state and seat to players individually
  lobby.players.forEach(id => {
    io.to(id).emit(Events.Sync, { state: game.gameState, seat: game.getSeat(id) });
  });

  // Send the game state to the whole room (for spectators)
  io.to(lobby.id).emit(Events.Sync, { state: game.gameState });
}

export default RequestRestart;
