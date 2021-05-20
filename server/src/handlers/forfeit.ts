import { Server } from 'socket.io';

import { Events, ForfeitRequestArgs, ioEmitter, Sync } from '../shared/types';
import { lobbies } from '../entities';

const emitSync = ioEmitter<Sync>(Events.Sync);

async function Forfeit(data: ForfeitRequestArgs, io: Server) {
  console.log({ data });
  const lobby = lobbies.get(data.lobbyId);
  const state = lobby.forfeit(data.playerId);

  emitSync(io, lobby.id, { state });

  // io.to(lobby.id).emit(Events.Sync, {
  //   state,
  // });
}

export default Forfeit;
