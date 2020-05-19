import nanoid = require('nanoid/generate');
import Game from './Game';
import { NotAuthenticatedError } from './errors';

export const games = new Map<string, Game>();
export const connections = new Map<string, string>();

export const createId = (size: number) =>
  nanoid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size);

export function getGame(id: string) {
  const room = connections.get(id);
  if (!room) {
    throw new NotAuthenticatedError(`No room for ID: ${id}`);
  }
  const game = games.get(room);
  if (!game) {
    throw new NotAuthenticatedError(`No game for ID: ${id}`);
  }
  return { room, game };
}

export function createNewGame(): { id: string; game: Game } {
  const id = createId(4);
  if (games.has(id)) return createNewGame();
  const game = new Game();
  return { id, game };
}

export function createLobby() {
  const { id, game } = createNewGame();
  games.set(id, game);
  return id;
}
