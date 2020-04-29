import play, { getInitialState } from '../shared/game';
import { ITurnInput, IGameState, Errors } from '../shared/types';

export enum Status {
  Pending = 'Pending',
  Started = 'Started',
  Finished = 'Finished',
}

export default class Game {
  // Status of the game lobby (pending, started, or finished)
  status: Status = Status.Pending;

  // The internal game state
  gameState: IGameState = getInitialState();

  // Connected players (socket IDs)
  players: Array<{ socket: string; id: string }> = [];

  // Two requests confirm a restart
  restartRequested: boolean = false;

  // Last updated timestamp
  updated: number = new Date().getTime();

  public addPlayer(socket: string, id: string) {
    if (this.status !== Status.Pending || this.players.length > 2) {
      throw new Error('Game already started');
    }

    const numPlayers = this.players.push({ socket, id });

    if (numPlayers === 2) {
      if (Math.floor(Math.random() * 2)) this.players.reverse();
      this.status = Status.Started;
    }

    this.updated = new Date().getTime();
  }

  public playTurn(payload: ITurnInput): { error?: Errors; state: IGameState } {
    const nextState = play(this.gameState, payload);

    if (!nextState.error) {
      this.gameState = nextState.state;
    }

    if (nextState.state.winner || nextState.state.tied) {
      this.status = Status.Finished;
    }

    this.updated = new Date().getTime();

    return nextState;
  }
}
