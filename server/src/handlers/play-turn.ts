import { Socket, Server } from 'socket.io';

import { Events, EventParams } from '../shared/types';
import { lobbies } from '../entities';
import logger from '../logger';

async function PlayTurn(data: EventParams[Events.PlayTurn], socket: Socket, io: Server) {
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
