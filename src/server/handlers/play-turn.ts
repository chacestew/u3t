import socketIO = require('socket.io');

import { Events, EventParams } from '../../shared/types';
import { lobbies } from '../entities';

async function PlayTurn(
  data: EventParams[Events.PlayTurn],
  socket: socketIO.Socket,
  io: socketIO.Server
) {
  const lobby = lobbies.get(data.room);
  const seat = lobby.getGame().getSeat(data.id);

  const payload = {
    player: seat,
    board: data.board,
    cell: data.cell,
  };

  let error;

  if (process.env.NODE_ENV === 'development' && data.dev === true) {
    lobby.endGameInstantly();
  } else {
    error = lobby.playTurn(payload).error;
  }

  const state = lobby.getGame().getState();

  if (error) {
    socket.emit(Events.InvalidTurn, {
      state,
      error,
    });
  } else {
    io.to(lobby.id).emit(Events.Sync, {
      state,
    });
  }
}

export default PlayTurn;
