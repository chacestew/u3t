import socketIO = require('socket.io');

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function PlayTurn(
  data: EventParams[Events.PlayTurn],
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const lobby = lobbies.getByPlayer(data.id);
  const game = lobby.getGame();

  const payload = {
    player: data.player,
    board: data.board,
    cell: data.cell,
  };

  const { state, error } = await game.playTurn(payload);

  if (process.env.NODE_ENV === 'development' && data.dev === true) {
    game.instantEnd();
  }

  if (error) {
    socket.emit(Events.InvalidTurn, {
      state: game.gameState,
      error: error,
    });
  } else {
    io.to(lobby.id).emit(Events.Sync, {
      state: game.gameState,
    });
  }

  if (state.finished) {
    // Handle game finished here
  }
}

export default PlayTurn;
