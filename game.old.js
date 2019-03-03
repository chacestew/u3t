const getWinnableSets = cell => {
  /* eslint-disable default-case */
  switch (cell) {
    case 0:
      return [[0, 1, 2], [0, 3, 6]];
    case 1:
      return [[0, 1, 2], [1, 4, 7]];
    case 2:
      return [[0, 1, 2], [2, 5, 8]];
    case 3:
      return [[0, 3, 6], [3, 4, 5]];
    case 4:
      return [[0, 4, 8], [1, 4, 7], [2, 4, 6], [3, 4, 5]];
    case 5:
      return [[2, 5, 8], [3, 4, 5]];
    case 6:
      return [[0, 3, 6], [6, 7, 8]];
    case 7:
      return [[1, 4, 7], [6, 7, 8]];
    case 8:
      return [[2, 5, 8], [6, 7, 8]];
  }
};

const nine = e => Array(9).fill(e);

const error = (message, ...rest) => ({ error: message, ...rest });

export const initialState = {
  turn: 0,
  boards: nine({ winner: null, cells: nine(null) }),
  activeBoard: 4,
  winner: null,
};

class Game {
  constructor({ playerOne = null, playerTwo = null }) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.state = {
      turn: 0,
      boards: nine({ winner: null, cells: nine(null) }),
      activeBoard: 4,
      winner: null,
    };
  }

  join(playerTwo) {
    if (this.playerTwo) return error('Player seat is already occuppied.');
    this.playerTwo = playerTwo;
    this.turnNumber = 1;
    return this.state;
  }

  getPlayerNumber(id) {
    if (this.playerOne === id) return 0;
    return 1;
  }

  getCurrentPlayer() {
    return this.turnNumber % 2 ? this.playerTwo : this.playerOne;
  }

  checkBoardWon({ player, board, cell }) {
    return getWinnableSets(cell).every(
      ([first, second, third]) => board[first] + board[second] + board[third] === 'OOO'
    );
  }

  checkGameWon({ board }) {
    const {
      state: { boards },
    } = this;

    return getWinnableSets(board).every(
      ([first, second, third]) =>
        boards[first].boardOwner === boards[second].boardOwner &&
        boards[first].boardOwner === boards[third].boardOwner
    );
  }

  isInvalidTurn({ player, board, cell }) {
    const {
      state: { boards, activeBoard },
    } = this;
    // Check valid player
    if (this.getCurrentPlayer() !== player)
      return error(`Not your turn ${this.getCurrentPlayer()} ${player}`);

    // Check valid board chosen
    if (board !== activeBoard && activeBoard !== null)
      return error(`Invalid board. Got: ${board}, expected ${activeBoard}`);

    // Check valid cell chosen
    if (boards[board].cells[cell] !== null) error('Chose invalid cell');

    return false;
  }

  updateBoard({ player, board, cell }) {
    const { state } = this;

    const symbol = this.getPlayerNumber(player) === 1 ? 'X' : '0';
    state.boards[board].cells[cell] = symbol;

    const didWinBoard = this.checkBoardWon({ board: state.boards[board], cell });
    console.log('didWinBoard', didWinBoard);
    if (didWinBoard) {
      state.boards[board].winner = symbol;
      const didWinGame = this.checkGameWon({ board });
      console.log('didWinGame', didWinGame);
      if (didWinGame) {
        state.winner = player;
      } else {
        state.turn += 1;
        state.activeBoard = state.boards[cell].winner ? null : cell;
      }
    }
  }

  playTurn(details) {
    // Guard against invalid turns
    const e = this.isInvalidTurn(details);
    if (e) return `Invalid turn: ${e.error}`;

    // Handle turn
    this.updateBoard(details);

    return this.state;
  }

  sync(serverState) {
    this.state = serverState;
  }

  getState() {
    return this.state;
  }

  // get state() {
  //   return this.state;
  // }
}
export default Game;
