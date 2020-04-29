import nanoid = require('nanoid/generate');
import socketIO = require('socket.io');
import Game, { Status } from './Game';
import { Application } from 'express';

import { Events } from '../shared/types';

const games = new Map();
const connections = new Map();

const createId = (size: number) =>
  nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size);

function getGame(id: string) {
  console.log('getGame called. All connections:', connections, id);
  const room = connections.get(id);
  if (!room) {
    // handle no room
  }
  const game = games.get(room);
  if (!game) {
    // handle no game
  }
  console.log({ room, game });
  return { room, game };
}

function createNewGame(): { id: string; game: Game } {
  const id = createId(4);
  if (games.has(id)) return createNewGame();
  const game = new Game();
  return { id, game };
}

function createLobby() {
  const { id, game } = createNewGame();
  games.set(id, game);
  return id;
}

export default (server: Application) => {
  const io = socketIO(server);

  io.on('connection', socket => {
    socket.on(Events.CreateLobby, () => {
      const id = createLobby();
      socket.emit(Events.LobbyReady, { id });
    });

    socket.on(Events.JoinLobby, data => {
      try {
        const { room } = data;
        const game: Game = games.get(room);
        console.log('join-lobby called', data);

        if (!game) throw new Error(`No game found by that ID: ${room}`);

        socket.join(room, err => {
          if (err) throw new Error(err);
          const id = createId(4);

          game.addPlayer(socket.id, id);
          connections.set(id, room);

          if (game.status === Status.Started) {
            const state = game.gameState;
            const players = game.players;
            io.to(players[0].socket).emit('game-started', {
              seat: 1,
              id: players[0].id,
              state,
            });
            io.to(players[1].socket).emit('game-started', {
              seat: 2,
              id: players[1].id,
              state,
            });
          }
        });
      } catch (e) {
        console.error(e);
        socket.emit('lobby-join-failed', { error: e.message });
      }
    });

    socket.on(Events.PlayTurn, async data => {
      const { room, game } = getGame(data.id);

      const payload = {
        id: socket.id,
        player: data.player,
        board: data.board,
        cell: data.cell,
      };

      const nextState = await game.playTurn(payload);

      if (nextState.error) {
        socket.emit(Events.InvalidTurn, nextState.error);
      } else {
        io.to(room).emit(Events.Sync, {
          state: nextState.state,
        });
      }
    });

    socket.on(Events.Restart, () => {
      const { room, game } = getGame(socket.id);

      if (game.restartRequested) {
        const id = createLobby();
        io.to(room).emit(Events.LobbyReady, { id });
      } else {
        game.restartRequested = true;
      }
    });

    socket.on('disconnect', () => {
      console.log('disconnected from GAME!', socket.id);
    });
  });
};
