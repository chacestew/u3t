import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import Grid from '../../Grid';
import Cell from './Cell';
import theme from '../../../utils/theme';
import toSymbol from '../../../utils/toSymbol';

const NewGrid = styled(Grid)`
  grid-gap: 4px;
  border: 4px solid ${theme.boardBorder};
  padding: 0;
  border-radius: 6px;
  background: ${theme.boardBorder};
  ${({ active }) => active && `box-shadow: 0 0 0 2px ${theme.boardActiveOutline};`}
  ${({ potentialBoard }) => potentialBoard && `box-shadow: 0 0 0 2px yellow;`}
  ${({ shouldDim }) => shouldDim && 'opacity: 0.5;'}
  ${({ boardWinner }) =>
    boardWinner &&
    css`&:before {
      content: '${toSymbol(boardWinner)}';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 7.1em;
    }`}`;

const Board = ({
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
    () => (gameWinner ? !winningSet.includes(boardIndex) : !!boardWinner),
    [gameWinner, boardWinner, winningSet, boardIndex]
  );
  const _onHover = cellIndex => void (active && onHover(cellIndex));
  return (
    <NewGrid
      onMouseLeave={() => onHover(null)}
      potentialBoard={potentialBoard}
      active={active}
      shouldDim={shouldDim}
      boardWinner={boardWinner}
    >
      {cells.map((cell, i) => (
        <Cell
          onClick={_onClick}
          onHover={_onHover}
          cellType={cell}
          cellIndex={i}
          key={i}
        />
      ))}
    </NewGrid>
  );
};

export default Board;
