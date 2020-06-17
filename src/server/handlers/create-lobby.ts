import socketIO = require('socket.io');

import { Events } from '../../shared/types';
import { lobbies } from '../entities';

async function createLobby(socket: socketIO.Socket) {
  const { id } = lobbies.create();
  socket.emit(Events.LobbyReady, { room: id });
}

export default createLobby;
