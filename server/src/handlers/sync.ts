import { Socket } from 'socket.io';

import { Events } from '../shared/types';
import { lobbies } from '../entities';

async function Sync(data: { room: string; id: string }, socket: Socket) {
  const lobby = lobbies.get(data.room);
  const game = lobby.getGame();

  socket.emit(Events.Sync, {
    state: game.getState(),
    seat: game.getSeat(data.id),
  });
}

export default Sync;
