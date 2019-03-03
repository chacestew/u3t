import playTurn, { initialState } from './game';

class ServerGame {
  constructor() {
    this.players = [];
    this.gameState = { ...initialState };
  }

  joinPlayer(id) {
    if (this.players.length >= 2) {
      throw new Error('Too many players?');
    }

    this.players.push({ id });

    if (this.players.length === 2) {
      this.assignSeats();
    }

    return this.players;
  }

  assignSeats() {
    if (Math.random() < 0.5) {
      this.players[0].seat = 1;
      this.players[1].seat = 2;
    } else {
      this.players[0].seat = 2;
      this.players[1].seat = 1;
    }
  }

  play() {
    const nextState = playTurn(this.gameState);
    this.gameState = nextState;
  }

  getGameState() {
    return this.gameState;
  }
}

export default ServerGame;
