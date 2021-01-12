import { Socket, Server } from 'socket.io';

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function RequestRestart(
  data: EventParams[Events.Restart],
  socket: Socket,
  io: Server
) {
  const lobby = lobbies.get(data.room);

  const hasRestarted = lobby.requestRestart(data.id, socket.id);

  if (!hasRestarted) return io.to(lobby.id).emit(Events.RestartRequested);

  const game = lobby.getGame();

  // Send the game state and seat to players individually
  lobby.players.forEach((id) => {
    io.to(id).emit(Events.Sync, { state: game.getState(), seat: game.getSeat(id) });
  });

  // Send the game state to the whole room (for spectators)
  io.to(lobby.id).emit(Events.Sync, { state: game.getState() });
}

export default RequestRestart;
