import play, { initialState, generateRandomMove } from '../shared/game';

const noop = () => {};

class PlayerManager {
  constructor(id, playRandomTurn, removePlayerFromGame) {
    this.id = id;
    this.seat = null;
    this.turnTimer = null;
    this.disconnectedTime = 120;
    this.disconnectedTimer = null;
    this.disconnectedAtTimestamp = null;
    this.playRandomTurn = playRandomTurn;
    this.removePlayerFromGame = removePlayerFromGame;
  }

  beginTurn() {
    this.turnTimer = setTimeout(() => {
      this.playRandomTurn(this.id);
    }, 60 * 1000);
  }

  disconnect() {
    this.disconnectedAtTimestamp = new Date().getTime();
    this.disconnectTimer = setTimeout(() => {
      this.removePlayer(this.id);
    }, 45 * 1000);
  }

  removePlayer() {
    this.clearInterval(this.disconnectTimer);
    this.clearInterval(this.turnTimer);
    this.removePlayerFromGame(this.id);
  }

  reconnect() {
    const now = new Date().getTime();
    this.disconnectedTime -= Math.ceil((now - this.disconnectedAtTimestamp) / 1000);
    this.disconnectedAtTimestamp = null;
    clearInterval(this.removePlayerFromGame);
  }
}

class GameManager {
  constructor(turnDuration) {
    this.seats = [];
    this.players = new Map();
    this.gameState = initialState;
    this.turnDuration = turnDuration;
  }

  joinPlayer(id) {
    if (this.seats.length >= 2) {
      throw new Error('Too many players');
    }

    if (this.players.has(id)) {
      throw new Error('Player already connected');
    }

    this.players.set(id, new PlayerManager(id));
    this.seats.push(id);

    return this.seats.length - 1;
  }

  disconnectPlayer(id) {
    if (!this.players.has(id)) throw new Error(`No player by ID "${id}" found`);
    this.players.get(id).removePlayer();
  }

  endGame(id) {
    const [winner] = this.seats.filter(seat !== id);
    const state = { ...this.gameState, winner };
    return { state };
  }

  assignSeats() {
    if (Math.floor(Math.random() * 2)) this.seats.reverse();

    return this.seats;
  }

  async playTurn(payload, emitter = noop) {
    const nextState = play(this.gameState, payload);

    if (!nextState.error) {
      this.gameState = nextState.state;

      // Handle turn duration
    }

    return nextState;
  }

  getGameState() {
    return this.gameState;
  }

  isReadyToStart() {
    return this.seats.length === 2;
  }
}

export default GameManager;
