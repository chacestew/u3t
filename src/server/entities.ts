import nanoid = require('nanoid/generate');
import Game from './Game';
import { NotAuthenticatedError } from './errors';

export const games = new Map<string, Game>();
export const playersToRooms = new Map<string, string>();
export const socketsToPlayers = new Map<string, string>();

export function createId({ notIn }: { notIn?: string[] } = {}): string {
  const id = nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
  if (notIn && notIn.includes(id)) return createId({ notIn });
  return id;
}

//0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz

// export function getGameById(id: string) {
//   const room = playersToRooms.get(id);
//   if (!room) {
//     throw new NotAuthenticatedError(`No room for ID: ${id}`);
//   }
//   const game = games.get(room);
//   if (!game) {
//     throw new NotAuthenticatedError(`No game for ID: ${id}`);
//   }
//   return { room, game };
// }

// export function getGameByRoom(room: string) {
//   const game = games.get(room);
//   if (!game) {
//     throw new NotAuthenticatedError(`No game for ID: ${room}`);
//   }
//   return { room, game };
// }

// export function createNewGame(): { id: string; game: Game } {
//   const id = createId(4);
//   if (games.has(id)) return createNewGame();
//   const game = new Game();
//   return { id, game };
// }

// export function createLobby() {
//   const { id, game } = createNewGame();
//   games.set(id, game);
//   return id;
// }

// New below

class Connection {
  socket: string;
  lobby: string | null = null;
  player: string | null = null;

  constructor(socket: string) {
    this.socket = socket;
  }
}

class ConnectionManager {
  connections: Map<string, Connection> = new Map();

  public add(id: string) {
    this.connections.set(id, new Connection(id));
  }

  public remove(id: string) {
    return this.connections.delete(id);
  }
}

export const Connections = new ConnectionManager();
export type SocketConnection = string;

class Player {
  id: string;
  sockets: Set<string> = new Set();

  constructor(id?: string) {
    this.id = id || createId();
  }

  public isConnected() {
    return !!this.sockets.size;
  }
}

class Lobby {
  id: string;
  players: Map<string, Player> = new Map();
  game?: Game;
  restartRequests: Map<string, string> = new Map();

  constructor() {
    this.id = createId();
  }

  public addPlayer(connection: SocketConnection) {
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

    this.game = new Game([...this.players.keys()]);
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

const relations = {
  playersToLobbies: new Map<string, string>(),
};

export const Lobbies = new LobbyManager();
