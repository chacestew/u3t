import cloneDeep from 'clone-deep';

const getWinnableSets = cell => {
  switch (cell) {
    case 0:
      return [[0, 1, 2], [0, 3, 6], [0, 4, 9]];
    case 1:
      return [[0, 1, 2], [1, 4, 7]];
    case 2:
      return [[0, 1, 2], [2, 5, 8], [2, 4, 6]];
    case 3:
      return [[0, 3, 6], [3, 4, 5]];
    case 4:
      return [[0, 4, 8], [1, 4, 7], [2, 4, 6], [3, 4, 5]];
    case 5:
      return [[2, 5, 8], [3, 4, 5]];
    case 6:
      return [[0, 3, 6], [6, 7, 8], [6, 4, 2]];
    case 7:
      return [[1, 4, 7], [6, 7, 8]];
    case 8:
      return [[2, 5, 8], [6, 7, 8], [8, 4, 0]];
    default:
      return [];
  }
};

// Private
const didWinBoard = (state, payload) => {
  const board = state.boards[payload.board];

  return getWinnableSets(payload.cell).some(([p1, p2, p3]) =>
    [board.cells[p1], board.cells[p2], board.cells[p3]].every(e => e === payload.player)
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
  currentPlayer: 1,
  boards: Array.from({ length: 9 }, () => ({
    winner: null,
    cells: Array(9).fill(null),
    cellsOpen: 9,
  })),
  activeBoard: 4,
  winner: null,
};

// payload = { player: id, board: Integer, cell: Integer }
export default (state, payload) => {
  const { player, board, cell } = payload;
  const nextState = cloneDeep(state);
  console.log('\n\n---playTurn called---');
  console.log('State:', state);
  console.log('Payload:', payload);

  if (nextState.currentPlayer !== player) {
    console.log('Play out of turn.');
    return { state: nextState, error: 'Play out of turn.' };
  }

  if (nextState.activeBoard && state.activeBoard !== board) {
    console.log('Chose wrong board.');
    return { state: nextState, error: 'Chose wrong board.' };
  }

  if (nextState.boards[board].cells[cell] !== null) {
    console.log('Cell is occupied.');
    return { state: nextState, error: 'Cell is occupied.' };
  }

  nextState.boards[board].cells[cell] = player;
  nextState.boards[board].cellsOpen -= 1;
  nextState.turn += 1;
  nextState.currentPlayer = nextState.currentPlayer === 1 ? 2 : 1;
  nextState.activeBoard =
    nextState.boards[cell].cellsOpen && !nextState.boards[cell].winner ? cell : null;

  if (!didWinBoard(nextState, payload)) {
    console.log('Normal turn complete.');
    return { state: { ...nextState } };
  }

  nextState.boards[board].winner = player;

  if (!didWinGame(nextState, payload)) {
    console.log('Won board!.');
    return { state: nextState };
  }

  nextState.winner = player;
  console.log('Won game!.');
  return { state: nextState };
};
