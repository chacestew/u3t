import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import Grid from '../../Grid';
import Cell from './Cell';
import palette from '../../../utils/palette';
import toSymbol from '../../../utils/toSymbol';

//   ${({ active }) => active && `box-shadow: 0 0 0 2px ${palette.boardActiveOutline};`}
// ${({ potentialBoard }) => potentialBoard && `box-shadow: 0 0 0 2px yellow;`}

const NewGrid = styled(Grid)`
  grid-gap: 4px;
  border-style: solid;
  border-color: ${palette.localGridBorder};
  border-width: 0 4px 4px 0;
  padding: 8px;
  &:nth-child(3n) {
    border-right: 0;
  }
  &:nth-child(n + 7) {
    border-bottom: 0;
  }
  ${({ shouldDim }) => shouldDim && 'opacity: 0.6;'}
  ${({ boardWinner }) =>
    boardWinner &&
    css`&:before {
      content: '${toSymbol(boardWinner)}';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 7.1em;
    }`}
  ${({ shouldFlash }) =>
    shouldFlash &&
    `
  background-color: skyblue;`}
`;

const Board = ({
  flashing,
  gameWinner,
  winningSet = [1, 4, 7],
  data: { cells, cellsOpen, winner: boardWinner },
  boardIndex,
  onClick,
  activeBoard,
  onHover,
  potentialBoard,
}) => {
  const _onClick = cellIndex => {
    onClick({ board: boardIndex, cell: cellIndex });
  };
  const active =
    !gameWinner &&
    ((cellsOpen && !boardWinner && activeBoard === null) || activeBoard === boardIndex);
  const shouldDim = useMemo(
    () =>
      // {
      //   if (gameWinner) {
      //     if (winningSet.includes(boardIndex)) return false;
      //     return true
      //   }
      //   if (activeBoard) return false;
      //   if (boardWinner) return true;
      // }
      gameWinner ? !winningSet.includes(boardIndex) : !active,
    [gameWinner, winningSet, boardIndex, active]
  );
  return (
    <NewGrid
      onMouseLeave={() => onHover(null)}
      potentialBoard={potentialBoard}
      active={active}
      shouldDim={shouldDim}
      shouldFlash={flashing}
      boardWinner={boardWinner}
    >
      {cells.map((cell, i) => (
        <Cell
          inPlayableArea={active}
          onClick={_onClick}
          cellType={cell}
          cellIndex={i}
          key={i}
        />
      ))}
    </NewGrid>
  );
};

export default Board;
