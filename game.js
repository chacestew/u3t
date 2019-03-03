const getWinnableSets = cell => {
  // TO DO: WHY IS THIS ESRULE COMPLAINING?
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

// Private
const didWinBoard = (state, payload) => {
  const board = state.boards[payload.board];

  return getWinnableSets(payload.cell).some(([p1, p2, p3]) =>
    [board[p1], board[p2], board[p3]].every(e => e === payload.player)
  );
};

const didWinGame = (state, payload) => {
  const { boards } = state;

  return getWinnableSets(payload.board).some(([p1, p2, p3]) =>
    [boards[p1], boards[p2], boards[p3]].every(({ winner }) => winner === payload.player)
  );
};

// Public
export const initialState = {
  turn: 0,
  boards: Array(9).fill({ winner: null, cells: Array(9).fill(null) }),
  activeBoard: 4,
  winner: null,
};

// payload = { player: id, board: Integer, cell: Integer }
export default (state, payload) => {
  const { player, board, cell } = payload;
  const nextState = { ...state };

  if (state.currentPlayer !== player) {
    return { state: nextState, error: 'Play out of turn.' };
  }

  if (state.currentBoard !== board) {
    return { state: nextState, error: 'Chose wrong board.' };
  }

  if (state.boards[board].cells[cell] === null) {
    return { state: nextState, error: 'Cell is occupied.' };
  }

  nextState.boards[board].cells[cell] = player;

  if (!didWinBoard(nextState, payload)) {
    return { state: nextState };
  }

  nextState.boards[board].winner = player;

  if (!didWinGame(nextState, payload)) {
    return { state: nextState };
  }

  nextState.winner = player;

  return { state: nextState };
};
