import play, { initialState } from './src/game';

const gameLength = 60 * 1000;
const noop = () => {
  console.log('noop called?!');
};

const generateRandomMove = state => {
  const { boards, currentPlayer: player, activeBoard } = state;

  const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];

  // optimise if reasonable
  const filteredBoards = boards.reduce((all, current, i) => {
    if (current.cellsOpen === 0) return all;

    return [...all, i];
  }, []);
  const board = activeBoard || randomElement(filteredBoards);

  const filteredCells = boards[board].cells.reduce((all, current, i) => {
    if (current !== null) return all;

    return [...all, i];
  }, []);
  const cell = randomElement(filteredCells);

  return { player, board, cell };
};

class ServerGame {
  constructor() {
    this.players = [];
    this.gameState = { ...initialState };
    this.turnDuration = null;
  }

  joinPlayer(id) {
    if (this.players.length >= 2) {
      return new Error('Too many players?');
    }

    return this.players.push(id) - 1;
  }

  assignSeats() {
    if (Math.floor(Math.random() * 2)) this.players.reverse();

    return this.players;
  }

  playTurn(payload, emitter = noop) {
    const nextState = play(this.gameState, payload);

    if (!nextState.error) {
      clearTimeout(this.interval);

      if (this.turnDuration) {
        this.interval = setTimeout(() => {
          emitter(this.playTurn(generateRandomMove(nextState.state), emitter));
        }, this.turnDuration);
      }
    }

    this.gameState = nextState.state;

    return nextState.state;
  }

  getGameState() {
    return this.gameState;
  }

  getPlayers() {
    return this.players;
  }

  isReadyToStart() {
    return this.players.length === 2;
  }
}

export default ServerGame;
