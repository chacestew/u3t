import { Server } from 'socket.io';

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function Forfeit(data: EventParams[Events.Forfeit], io: Server) {
  console.log({ data });
  const lobby = lobbies.get(data.room);
  const state = lobby.forfeit(data.id);

  io.to(lobby.id).emit(Events.Sync, {
    state,
  });
}

export default Forfeit;
