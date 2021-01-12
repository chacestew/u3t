import { Socket } from 'socket.io';

import { Events } from '../../shared/types';
import { lobbies } from '../entities';

async function createLobby(socket: Socket) {
  const { id } = lobbies.create();
  socket.emit(Events.LobbyReady, { room: id });
}

export default createLobby;
