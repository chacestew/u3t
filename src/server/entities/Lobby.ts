import nanoid = require('nanoid/generate');

import Game from './Game';
import Player from './Player';
import { NotFoundError, BadRequestError } from '../errors';

export class Lobby {
  id: string;
  players: Map<string, Player> = new Map();
  game?: Game;
  restartRequests: Map<string, string> = new Map();
  updated: number = new Date().getTime();

  constructor() {
    this.id = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
  }

  private update() {
    this.updated = new Date().getTime();
  }

  public addPlayer(connection: string) {
    if (this.players.size > 1) throw new BadRequestError('Lobby already has two players');
    const player = new Player();
    player.sockets.add(connection);
    this.players.set(player.id, player);
    return player.id;
  }

  public getPlayer(id: string) {
    const player = this.players.get(id);

    if (!player) throw new NotFoundError(`No player with ID: ${id}`);

    return player;
  }

  public requestRestart(id: string, socket: string) {
    this.restartRequests.set(id, socket);

    return this.restartRequests.size === 2;
  }

  public initGame() {
    return (this.game = new Game({
      players: [...this.players.keys()],
      onUpdate: this.update,
    }));
  }

  public getGame(): Game {
    if (!this.game) throw new NotFoundError(`No game started for lobby ${this.id}`);
    return this.game;
  }

  public getGameOrNull() {
    return this.game || null;
  }
}

class LobbyManager {
  lobbies: Map<string, Lobby> = new Map();

  public create() {
    const lobby = new Lobby();
    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  public remove(id: string) {
    return this.lobbies.delete(id);
  }

  public get(id: string): Lobby {
    const lobby = this.lobbies.get(id);
    if (!lobby) throw new Error(`No lobby by ID: ${id}`);
    return lobby;
  }

  public getByPlayer(id: string): Lobby {
    for (const [_, lobby] of this.lobbies) {
      if (lobby.players.has(id)) return lobby;
    }
    throw new Error(`No lobby with player ${id}`);
  }
}

export default LobbyManager;
