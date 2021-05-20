import { Socket, Server } from 'socket.io';

import {
  JoinLobbyRequestArgs,
  JoinLobbyResponses,
  SocketCallback,
  Events,
  ioEmitter,
  GameStarted,
} from '../shared/types2/types';
import { lobbies } from '../entities';
import logger from '../logger';

const emitGameStarted = ioEmitter<GameStarted>(Events.GameStarted);

export default async function joinLobby(
  socket: Socket,
  io: Server,
  data: JoinLobbyRequestArgs,
  cb: SocketCallback<JoinLobbyResponses>
) {
  const lobby = lobbies.get(data.lobbyId);
  // Handle spectator joining
  if ((!data.playerId && lobby.hasGame()) || data.spectator) {
    cb({
      lobbyId: lobby.id,
      state: lobby.getGame().getState(),
      role: 'spectator',
    });
    // Handle player rejoining a game
  } else if (data.playerId) {
    logger.info('Rejoining player to lobby', {
      data: { lobby: lobby.id, player: data.playerId },
    });
    const game = lobby.getGame();
    cb({
      lobbyId: lobby.id,
      seat: game.getSeat(lobby.id),
      state: game.getState(),
      role: 'reconnected-player',
    });
  } else {
    // Handle first time joining a game
    logger.info('Joining new player to lobby', { data: { lobby: lobby.id } });
    const playerId = lobby.addPlayer(socket.id);

    socket.join(playerId);

    cb({ lobbyId: lobby.id, playerId, role: 'new-player' });

    // Start when second player joined
    if (!lobby.hasGame() && lobby.players.size === 2) {
      logger.info('Starting new game for lobby', { data: { lobby: lobby.id } });
      const game = lobby.initGame();

      lobby.players.forEach((playerId) => {
        logger.info('Emitting game started message:', {
          data: { lobbyId: lobby.id, playerId, seat: game.getSeat(playerId) },
        });
        emitGameStarted(io, playerId, {
          lobbyId: lobby.id,
          playerId,
          seat: game.getSeat(playerId),
          state: game.getState(),
        });
      });
    }
  }
}
