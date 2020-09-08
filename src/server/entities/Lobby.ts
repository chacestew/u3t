import { customAlphabet } from 'nanoid';
import Game from './Game';
import { NotFoundError, BadRequestError } from '../errors';
import { ITurnInput } from '../../shared/types';
import { lobbies } from '.';
import logger from '../logger';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const LOBBY_EXPIRATION_TIME = 1000 * 60 * 1;

function createID(collection: Map<string, any>): string {
  const id = nanoid();
  if (!collection.has(id)) return id;
  return createID(collection);
}

export class Lobby {
  readonly id: string;
  readonly players: Set<string> = new Set();
  readonly restartRequests: Map<string, string> = new Map();
  private game?: Game;
  readonly timer: NodeJS.Timeout;
  logger: (message: string, data?: { [key: string]: any }) => void;
  updated: number = new Date().getTime();

  constructor(id: string, destroy: typeof lobbies.remove) {
    this.id = id;
    this.timer = global.setTimeout(() => {
      destroy(this.id);
      global.clearInterval(this.timer);
    }, LOBBY_EXPIRATION_TIME);
    this.logger = (message, data) => logger.info(`[Lobby#${this.id}]: ${message}`, data);
  }

  private refresh = () => {
    this.timer.refresh();
  };

  addPlayer(connection: string) {
    if (this.players.size > 1) throw new BadRequestError('Lobby already has two players');
    const id = `${this.id}_${nanoid()}`;
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
    this.logger('Initialised new game', { data: { lobby: this.id } });
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
    console.log('THIS!!!!', this);
    this.logger('Playing turn', { data: turnInput });
    return this.getGame().playTurn(turnInput);
  }

  forfeit(player: string) {
    this.logger('Forfeiting');
    return this.getGame().forfeit(player);
  }

  endGameInstantly() {
    return this.getGame().instantEnd();
  }
}

class LobbyManager {
  lobbies: Map<string, Lobby> = new Map();

  create() {
    const id = createID(this.lobbies);
    const lobby = new Lobby(id, this.remove);
    this.lobbies.set(lobby.id, lobby);
    logger.info(`Created lobby: ${id}`);
    return lobby;
  }

  remove = (id: string) => {
    logger.info(`Removed lobby: ${id}`);
    return this.lobbies.delete(id);
  };

  get(id: string): Lobby {
    const lobby = this.lobbies.get(id);
    if (!lobby) throw new NotFoundError(`No lobby by ID: ${id}`);
    return lobby;
  }
}

export default LobbyManager;
