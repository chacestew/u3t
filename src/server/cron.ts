import socketIO = require('socket.io');

import { lobbies, Lobby } from './entities';

const MAX_GAME_FINISHED_AGE = 1000 * 60 * 5;
const GAME_EXPIRATION_AGE = 1000 * 60 * 60 * 24;
const CRON_INTERVAL = 1000 * 60 * 20;

const exceedsFinishedExpirationTime = (timestamp: number) =>
  timestamp + MAX_GAME_FINISHED_AGE < new Date().getTime();
const exceedsStaleExpirationTime = (timestamp: number) =>
  timestamp + GAME_EXPIRATION_AGE < new Date().getTime();

const allPlayersDisconnected = (lobby: Lobby) => {
  for (const player of lobby.players.values()) {
    if (player.isConnected) return false;
  }
  return true;
};

class Cron {
  interval: number;
  timer: NodeJS.Timeout;
  lastCalled: number = new Date().getTime();
  awake: boolean = true;

  constructor(interval: number = CRON_INTERVAL) {
    this.interval = interval;
    this.timer = global.setTimeout(() => {
      this.clean();
    }, interval);
  }

  private clean() {
    console.log('Running clean...');
    try {
      for (const [id, lobby] of lobbies.lobbies) {
        const isFinished = lobby.hasGame() && lobby.getGame().gameState.finished;
        if (
          (isFinished && exceedsFinishedExpirationTime(lobby.updated)) ||
          exceedsStaleExpirationTime(lobby.updated) ||
          allPlayersDisconnected(lobby)
        ) {
          console.log('Removing lobby:', id);
          lobbies.remove(id);
        }
      }

      if (lobbies.lobbies.size > 0) this.continue();
      else this.awake = false;
    } catch (e) {
      console.error(`Error inside clean: ${e}`);
    }
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
