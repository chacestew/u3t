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

class Game {
  constructor(playerOne) {
    this.turnNumber = 0;
    this.currentBoard = 4;
    this.gameState = [
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
      {
        boardOwner: null,
        boardState: [null, null, null, null, null, null, null, null, null],
      },
    ];
    this.playerOne = playerOne;
  }

  join(playerTwo) {
    this.playerTwo = playerTwo;
    this.turnNumber = 1;
  }

  getPlayerNumber(id) {
    if (this.playerOne === id) return 0;
    return 1;
  }

  getCurrentPlayer() {
    return this.turnNumber % 2 ? 0 : 1;
  }

  checkBoardWon({ player, board, cell }) {
    const { boardState } = this.gameState[board];

    const didWin = getWinnableSets(cell).every(
      ([first, second, third]) =>
        boardState[first] === boardState[second] &&
        boardState[first] === boardState[third]
    );

    if (didWin) {
      this.gameState[board].boardOwner = player;
      return true;
    }

    return false;
  }

  checkGameWon({ board }) {
    const { gameState } = this;

    const didWin = getWinnableSets(board).every(
      ([first, second, third]) =>
        gameState[first].boardOwner === gameState[second].boardOwner &&
        gameState[first].boardOwner === gameState[third].boardOwner
    );

    return false;
  }

  getGameState() {
    const { turnNumber, currentBoard, gameState } = this;
    return { turnNumber, currentBoard, gameState };
  }

  playTurn({ player, board, cell }) {
    // Check is players turn
    // const requestingPlayer =
    if (this.getCurrentPlayer() !== player) return { error: 'Not your turn' };

    // Check valid board chosen
    if (board !== this.currentBoard && this.currentBoard !== null)
      return { error: 'Chose invalid board' };

    // Check valid cell chosen
    if (this.gameState[board].boardState[cell] !== null)
      return { error: 'Chose invalid cell' };

    this.gameState[board].boardState[cell] = player === 1 ? 'X' : 'O';

    const didWinBoard = this.checkBoardWon({ player, board, cell });

    if (didWinBoard && this.checkGameWon()) {
      return { state: this.getGameState(), winner: player };
    }

    this.turnNumber = this.turnNumber + 1;
    this.currentBoard = this.gameState[cell].boardOwner ? null : cell;
    return { state: this.getGameState() };
  }
}

export default Game;
