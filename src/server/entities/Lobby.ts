import nanoidGen = require('nanoid/generate');
import nanoid = require('nanoid');

import Game from './Game';
import { NotFoundError, BadRequestError } from '../errors';
import { ITurnInput } from '../../shared/types';

const LOBBY_EXPIRATION_TIME = 1000 * 60 * 1;

export class Lobby {
  readonly id: string;
  readonly players: Set<string> = new Set();
  readonly restartRequests: Map<string, string> = new Map();
  private game?: Game;
  readonly timer: NodeJS.Timeout;
  updated: number = new Date().getTime();

  constructor(destroy: (id: string) => boolean) {
    this.id = nanoidGen('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
    this.timer = global.setTimeout(() => {
      console.log('about to destroy');
      destroy(this.id);
      console.log('done destroy');
      global.clearInterval(this.timer);
    }, LOBBY_EXPIRATION_TIME);
    console.log('this.timer', this.timer);
  }

  private refresh = () => {
    this.timer.refresh();
  };

  addPlayer(connection: string) {
    if (this.players.size > 1) throw new BadRequestError('Lobby already has two players');
    const id = `${this.id}_${nanoid(4)}`;
    this.players.add(id);
    return id;
  }

  requestRestart(id: string, socket: string) {
    this.restartRequests.set(id, socket);

    if (this.restartRequests.size !== 2) return false;

    this.initGame();

    this.restartRequests.clear();

    return true;
  }

  initGame() {
    return (this.game = new Game({
      players: [...this.players.values()],
      onUpdate: this.refresh,
    }));
  }

  hasGame() {
    return !!this.game;
  }

  getGame() {
    if (!this.game) throw new Error('Game not started');

    return this.game;
  }

  playTurn(turnInput: ITurnInput) {
    return this.getGame().playTurn(turnInput);
  }

  forfeit(player: string) {
    return this.getGame().forfeit(player);
  }

  endGameInstantly() {
    return this.getGame().instantEnd();
  }
}

class LobbyManager {
  lobbies: Map<string, Lobby> = new Map();

  create() {
    const lobby = new Lobby(this.remove);
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  remove = (id: string) => {
    console.log('Removing lobby', id);
    return this.lobbies.delete(id);
  };

  get(id: string): Lobby {
    const lobby = this.lobbies.get(id);
    if (!lobby) throw new NotFoundError(`No lobby by ID: ${id}`);
    return lobby;
  }
}

export default LobbyManager;
