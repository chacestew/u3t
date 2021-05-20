import { Socket } from 'socket.io';

import { Events, Sync, emitter, ResyncArgs } from '../shared/types';
import { lobbies } from '../entities';

const emitSync = emitter<Sync>(Events.Sync);

async function Resync(data: ResyncArgs, socket: Socket) {
  const lobby = lobbies.get(data.lobbyId);
  const game = lobby.getGame();

  emitSync(socket, {
    state: game.getState(),
    seat: game.getSeat(data.playerId),
  });
}

export default Resync;
