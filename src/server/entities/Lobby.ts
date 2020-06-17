import nanoid = require('nanoid/generate');

import Game from './Game';
import Player from './Player';

export class Lobby {
  id: string;
  players: Map<string, Player> = new Map();
  game?: Game;
  restartRequests: Map<string, string> = new Map();

  constructor() {
    this.id = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
  }

  public addPlayer(connection: string) {
    if (this.players.size > 1) throw new Error('Too many players in game.');
    const player = new Player();
    player.sockets.add(connection);
    this.players.set(player.id, player);
    return player.id;
  }

  public getPlayer(id: string) {
    const player = this.players.get(id);

    if (!player) throw new Error(`No player found for ID: ${id}`);

    return player;
  }

  public requestRestart(id: string, socket: string) {
    this.restartRequests.set(id, socket);

    return this.restartRequests.size === 2;
  }

  public initGame() {
    if (this.players.size < 2) throw new Error('Not enough players.');

    return (this.game = new Game([...this.players.keys()]));
  }

  public getGame(): Game {
    if (!this.game) throw new Error('No game started for this lobby');
    return this.game;
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
