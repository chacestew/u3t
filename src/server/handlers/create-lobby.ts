import socketIO = require('socket.io');

import { Events } from '../../shared/types';
import { lobbies } from '../entities';
import { cron } from '../sockets';

async function createLobby(socket: socketIO.Socket) {
  const { id } = lobbies.create();
  cron.prod();
  socket.emit(Events.LobbyReady, { room: id });
}

export default createLobby;
