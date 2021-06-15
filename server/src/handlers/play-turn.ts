import {
  Events,
  ioEmitter,
  PlayTurnRequestArgs,
  PlayTurnResponse,
  SocketCallback,
  Sync,
} from '@u3t/common';
import { Server } from 'socket.io';

import { lobbies } from '../entities';

const emitSync = ioEmitter<Sync>(Events.Sync);

async function PlayTurn(
  data: PlayTurnRequestArgs,
  io: Server,
  cb: SocketCallback<PlayTurnResponse>
) {
  const lobby = lobbies.get(data.lobbyId);
  const seat = lobby.getGame().getSeat(data.playerId);

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
    throw new Error(error);
  } else {
    cb({ valid: true });
    emitSync(io, lobby.id, { state });
  }
}

export default PlayTurn;
