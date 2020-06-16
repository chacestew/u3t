import socketIO = require('socket.io');

import { Events, EventParams } from '../shared/types';
import { socketsToPlayers, Lobbies } from './entities';

export const CreateLobby = async (socket: socketIO.Socket) => {
  const { id } = Lobbies.create();
  socket.emit(Events.LobbyReady, { room: id });
};

export const JoinLobby = async (
  data: { room: string; id?: string },
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const { room, id } = data;
  const lobby = Lobbies.get(room);

  socket.join(lobby.id, err => {
    if (err) throw new Error(err);

    // Handle spectator connecting
    if (!id && lobby.players.size >= 2) {
      const state = lobby.game ? lobby.getGame().gameState : null;
      return socket.emit(Events.JoinedAsSpectator, { state });
    }

    if (id) {
      // Handle player reconnecting

      lobby.getPlayer(id).sockets.add(socket.id);

      if (lobby.game) {
        const a = socket.emit(Events.RejoinGame, {
          seat: lobby.game.seats.indexOf(id),
          state: lobby.game.gameState,
        });

        return;
      }
    } else {
      // Handle player connecting
      lobby.addPlayer(socket.id);
    }

    if (lobby.players.size < 2) return;

    lobby.initGame();

    const game = lobby.game!;

    game.seats.forEach((id, seat) => {
      const { sockets } = lobby.getPlayer(id);
      for (const socket of sockets) {
        io.to(socket).emit(Events.StartGame, {
          seat: seat + 1,
          id,
          state: game.gameState,
        });
      }
    });
  });
};

export const PlayTurn = async (
  data: EventParams[Events.PlayTurn],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const lobby = Lobbies.getByPlayer(data.id);
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
};

export const RequestRestart = async (
  data: EventParams[Events.Restart],
  socket: socketIO.Socket,
  io: socketIO.Server
) => {
  const lobby = Lobbies.getByPlayer(data.id);

  const twoRequestsReceived = lobby.requestRestart(data.id, socket.id);

  if (twoRequestsReceived) {
    const nextLobby = Lobbies.create();

    for (const [_, socket] of lobby.restartRequests) {
      const id = nextLobby.addPlayer(socket);
      io.to(socket).emit(Events.LobbyReady, { room: nextLobby.id, id });
    }

    console.log('new lobby:', nextLobby.id, 'players:', nextLobby.players.values());

    io.to(lobby.id).emit(Events.LobbyReady, { room: nextLobby.id });

    // for (const socket of lobby.restartRequests.values()) {
    //   io.to(socket).emit(Events.LobbyReady, { id });
    // }
    // Handle lobby finished here
  } else {
    io.to(lobby.id).emit(Events.RestartRequested);
  }
};

export const Disconnected = async (socket: socketIO.Socket) => {
  socketsToPlayers.delete(socket.id);
};
