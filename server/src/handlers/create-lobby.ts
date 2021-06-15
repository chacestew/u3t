import { CreateLobbyResponse, SocketCallback } from '@u3t/common';
import { Socket } from 'socket.io';

import { lobbies } from '../entities';

async function createLobby(socket: Socket, cb: SocketCallback<CreateLobbyResponse>) {
  const lobby = lobbies.create();
  const playerId = lobby.addPlayer();
  const data = { lobbyId: lobby.id, playerId };
  cb(data);
  return data;
}

export default createLobby;
