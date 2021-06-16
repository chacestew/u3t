import {
  Ack,
  Events,
  PlayTurnRequestArgs,
  PlayTurnResponse,
  ServerManager,
} from '@u3t/common';

import { lobbies } from '../entities';

async function PlayTurn(
  data: PlayTurnRequestArgs,
  io: ServerManager,
  cb: Ack<PlayTurnResponse>
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
    io.to(lobby.id).emit(Events.Sync, { state });
  }
}

export default PlayTurn;
