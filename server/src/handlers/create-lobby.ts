import { Socket } from 'socket.io';

import { SocketCallback, CreateLobbyResponse } from '../shared/types2/types';
import { lobbies } from '../entities';

async function createLobby(socket: Socket, cb: SocketCallback<CreateLobbyResponse>) {
  const lobby = lobbies.create();
  const playerId = lobby.addPlayer(socket.id);
  cb({ lobbyId: lobby.id, playerId: playerId });
}

export default createLobby;
