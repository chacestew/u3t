import play, { getInitialState, generateRandomMove, forfeit } from '../../shared/game';
import { ITurnInput, IGameState, Errors, Player } from '../../shared/types';
import { BadRequestError } from '../errors';

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
  readonly seats: string[] = [];
  // Last updated timestamp
  readonly onUpdate: () => void;

  constructor({ players, onUpdate }: { players: string[]; onUpdate: () => void }) {
    console.log('players?', players);
    this.seats = [...players];
    if (Math.floor(Math.random() * 2)) this.seats.reverse();
    this.onUpdate = onUpdate;
  }

  playTurn(payload: ITurnInput): { error?: Errors; state: IGameState } {
    const nextState = play(this.gameState, payload, true);

    if (!nextState.error) {
      this.gameState = nextState.state;
    }

    this.onUpdate();

    return nextState;
  }

  getSeat(id: string) {
    console.log('Seats:', this.seats);
    const seat = this.seats.indexOf(id);
    if (seat === -1) throw new Error(`No seat for player: ${id}`);
    return (seat + 1) as Player;
  }

  forfeit(player: string) {
    const seat = this.getSeat(player);
    return (this.gameState = forfeit(this.gameState, seat));
  }

  restart() {
    this.gameState = getInitialState();
    this.onUpdate();
  }

  instantEnd = () => {
    const nextState = instantEnd(this.gameState);
    this.gameState = nextState;
    this.onUpdate();
  };
}
