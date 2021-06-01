import { Socket } from 'socket.io';

import { SocketCallback, CreateLobbyResponse } from '@u3t/common';
import { lobbies } from '../entities';

async function createLobby(socket: Socket, cb: SocketCallback<CreateLobbyResponse>) {
  const lobby = lobbies.create();
  const playerId = lobby.addPlayer(socket.id);
  const data = { lobbyId: lobby.id, playerId };
  cb(data);
  return data;
}

export default createLobby;
