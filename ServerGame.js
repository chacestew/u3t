import play, { initialState } from './src/game';

class ServerGame {
  constructor({ players = [] }) {
    this.playerIds = [];
    this.seats = [];
    this.gameState = { ...initialState };
  }

  joinPlayer(id) {
    if (this.playerIds.length >= 2) {
      throw new Error('Too many players?');
    }

    return this.playerIds.push(id);
  }

  playTurn(payload) {
    const nextState = play(this.gameState, payload);
    this.gameState = nextState.state;
    return nextState.state;
  }

  getGameState() {
    return this.gameState;
  }

  isReadyToStart() {
    return this.seats.length === 2;
  }
}

export default ServerGame;
