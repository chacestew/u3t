import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import Grid from '../Grid';
import Cell from './Cell';
import theme from '../../../shared/theme';
import toSymbol from '../../../shared/toSymbol';

const NewGrid = styled(Grid)`
  grid-gap: 4px;
  border: 4px solid ${theme.boardBorder};
  padding: 0;
  border-radius: 6px;
  background: ${theme.boardBorder};
  ${props => props.active && `box-shadow: 0 0 0 2px ${theme.boardActiveOutline};`}
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
  return (
    <NewGrid active={active} shouldDim={shouldDim} boardWinner={boardWinner}>
      {cells.map((cell, i) => (
        <Cell onClick={_onClick} cellType={cell} cellIndex={i} key={i} />
      ))}
    </NewGrid>
  );
};

export default Board;
