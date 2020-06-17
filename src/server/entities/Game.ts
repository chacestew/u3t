import play, { getInitialState, generateRandomMove } from '../../shared/game';
import { ITurnInput, IGameState, Errors } from '../../shared/types';

function instantEnd(state: IGameState): IGameState {
  const turn = generateRandomMove(state);

  const nextState = play(state, turn).state;

  if (nextState.finished) return nextState;

  return instantEnd(nextState);
}

export default class Game {
  // The internal game state
  gameState: IGameState = getInitialState();
  // Seats
  seats: string[];
  // Last updated timestamp
  updated: number = new Date().getTime();

  constructor(players: string[]) {
    console.log('players?', players);
    this.seats = [...players];
    if (Math.floor(Math.random() * 2)) this.seats.reverse();
  }

  public playTurn(payload: ITurnInput): { error?: Errors; state: IGameState } {
    const nextState = play(this.gameState, payload, true);

    if (!nextState.error) {
      this.gameState = nextState.state;
    }

    this.updated = new Date().getTime();

    return nextState;
  }

  public instantEnd() {
    const nextState = instantEnd(this.gameState);
    this.gameState = nextState;
  }
}
