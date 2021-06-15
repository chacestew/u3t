import { Events, ioEmitter, RestartRequestArgs, Sync } from '@u3t/common';
import { Server, Socket } from 'socket.io';

import { lobbies } from '../entities';

const emitRestartRequested = ioEmitter(Events.RestartRequested);
const emitSync = ioEmitter<Sync>(Events.Sync);

async function RequestRestart(data: RestartRequestArgs, socket: Socket, io: Server) {
  const lobby = lobbies.get(data.lobbyId);

  const hasRestarted = lobby.requestRestart(data.playerId, socket.id);

  if (!hasRestarted) {
    emitRestartRequested(io, lobby.id);
  } else {
    const game = lobby.getGame();

    // Send the game state and seat to players individually
    lobby.players.forEach((id) => {
      emitSync(io, id, { state: game.getState(), seat: game.getSeat(id) });
      // io.to(id).emit(Events.Sync, { state: game.getState(), seat: game.getSeat(id) });
    });

    // Send the game state to the whole room (for spectators)
    emitSync(io, lobby.id, { state: game.getState() });
    // io.to(lobby.id).emit(Events.Sync, { state: game.getState() });
  }
}

export default RequestRestart;
