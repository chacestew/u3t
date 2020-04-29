import cloneDeep from 'clone-deep';
import * as types from './types';

const getWinnableSets = (cell: types.Cell) => {
  switch (cell) {
    case 0:
      return [[0, 1, 2], [0, 3, 6], [0, 4, 8]];
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
const didWinBoard = (state: types.IGameState, payload: types.ITurnInput) => {
  const board = state.boards[payload.board];

  return getWinnableSets(payload.cell).some(([p1, p2, p3]) =>
    [board.cells[p1], board.cells[p2], board.cells[p3]].every(e => e === payload.player)
  );
};

const didWinGame = (state: types.IGameState, payload: types.ITurnInput) => {
  const { boards } = state;

  return getWinnableSets(payload.board).find(([p1, p2, p3]) =>
    [boards[p1], boards[p2], boards[p3]].every(({ winner }) => winner === payload.player)
  );
};

// Public
export const generateRandomMove = (state: types.IGameState) => {
  const { boards, currentPlayer: player, activeBoard } = state;

  const randomElement = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

  // optimise if reasonable
  const filteredBoards = boards.reduce((all: any, current, i) => {
    if (current.cellsOpen === 0) return all;

    return [...all, i];
  }, []);
  const board = activeBoard !== null ? activeBoard : randomElement(filteredBoards);

  if (!boards[board]) console.error('PROBLEM BOARD:', board);
  const filteredCells = boards[board].cells.reduce((all: any, current, i) => {
    if (current !== null) return all;

    return [...all, i];
  }, []);
  const cell = randomElement(filteredCells);

  return { player, board, cell };
};

export function getInitialState(): types.IGameState {
  return {
    turn: 1,
    currentPlayer: 1,
    boards: Array.from({ length: 9 }, () => ({
      winner: null,
      cells: Array(9).fill(null),
      cellsOpen: 9,
      tied: false,
    })),
    activeBoard: null,
    winner: null,
    totalCellsOpen: 81,
    tied: false,
    finished: false,
    winningSet: null,
  };
}

function isInvalidTurn(state: types.IGameState, turn: types.ITurnInput) {
  const { player, board, cell } = turn;
  console.log('HERE WE GO', { turn, state });
  if (state.currentPlayer !== player) {
    console.log('Play out of turn.');
    return types.Errors.WrongTurn;
  }

  if (state.activeBoard !== null && state.activeBoard !== board) {
    console.log('Chose wrong board.');
    return types.Errors.BoardNotPlayable;
  }

  if (state.boards[board].winner || state.boards[board].tied) {
    console.log('Board not playable');
    return types.Errors.BoardNotPlayable;
  }

  if (state.boards[board].cells[cell] !== null) {
    console.log('Cell is occupied.');
    return types.Errors.CellOccupied;
  }
}
// payload = { player: id, board: Integer, cell: Integer }
export default function(
  state: types.IGameState,
  payload: types.ITurnInput
): { error?: types.Errors; state: types.IGameState } {
  const { player, board, cell } = payload;

  console.log('\n\n---playTurn called---');
  console.log('State:', state);
  console.log('Payload:', payload);

  const error = isInvalidTurn(state, payload);
  if (error) {
    return { error, state };
  }

  // Turn is valid, proceed to clone state
  const nextState = cloneDeep(state);

  // Capture cell
  nextState.boards[board].cells[cell] = player;
  nextState.boards[board].cellsOpen -= 1;
  nextState.totalCellsOpen -= 1;

  if (didWinBoard(nextState, payload)) {
    nextState.boards[board].winner = player;

    const winningSet = didWinGame(nextState, payload);

    if (winningSet) {
      nextState.winningSet = winningSet;
      nextState.winner = player;
      nextState.finished = true;

      return { state: nextState };
    }
  }

  if (nextState.totalCellsOpen === 0) {
    nextState.tied = true;
    nextState.finished = true;

    return { state: nextState };
  }

  nextState.turn += 1;
  nextState.currentPlayer = nextState.currentPlayer === 1 ? 2 : 1;
  nextState.activeBoard =
    nextState.boards[cell].cellsOpen && !nextState.boards[cell].winner ? cell : null;

  return { state: nextState };
}
