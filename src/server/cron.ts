import socketIO = require('socket.io');

import game from '../shared/game';
import { games, playersToRooms, socketsToPlayers } from './entities/entities';
import sockets from './sockets';

const GAME_FINISHED_AGE = 1000 * 60 * 5;
const GAME_EXPIRATION_AGE = 1000 * 60 * 60 * 24;

class Cron {
  interval: number;
  timer: NodeJS.Timeout;
  lastCalled: number = new Date().getTime();
  awake: boolean = true;
  io: socketIO.Server;

  constructor(interval: number = 1000 * 60 * 20, io: socketIO.Server) {
    this.interval = interval;
    this.io = io;
    this.timer = global.setTimeout(() => {
      this.clean();
    }, interval);
  }

  private clean() {
    const gamesToDelete = [];
    for (const [room, game] of games.entries()) {
      if (
        (game.gameState.finished && game.updated + GAME_EXPIRATION_AGE < this.now()) ||
        game.updated + GAME_EXPIRATION_AGE < this.now()
      ) {
        // Get the player IDs in this game (n = 2)
        const players = [...game.players].map(([id]) => id);

        // Remove their relations to the game room (n = 2)
        players.forEach(id => playersToRooms.delete(id));

        // Remove all socket relations to the players (n >= 1 per player)
        socketsToPlayers.forEach((socket, player) => {
          if (players.includes(player)) socketsToPlayers.delete(socket);
        });

        // Finally, remove the game object
        games.delete(room);
      }
    }

    if (games.size > 0) this.continue();
    else this.awake = false;
  }

  private now() {
    return new Date().getTime();
  }

  private continue() {
    this.lastCalled = this.now();
    this.timer.refresh();
  }

  public prod() {
    if (this.awake) return;
    this.continue();
  }

  public timeUntil() {
    if (!this.awake) return 0;

    return this.lastCalled + this.interval - this.now();
  }
}

export default Cron;
