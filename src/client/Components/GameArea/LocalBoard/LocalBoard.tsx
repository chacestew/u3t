import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import Grid from '../../Grid';
import Cell from './Cell';
import palette from '../../../utils/palette';
import toSymbol from '../../../utils/toSymbol';
import * as T from '../../../../shared/types';

interface StyledProps {
  shouldDim: boolean;
  boardWinner: null | T.Player;
  shouldFlash: boolean;
}

const NewGrid = styled(Grid)<StyledProps>`
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

interface Props {
  flashing: boolean;
  gameWinner: null | T.Player;
  winningSet: Array<null | number>;
  data: T.IBoardState;
  boardIndex: T.Board;
  onClick: any;
  activeBoard: T.Board[];
}

const Board = ({
  flashing,
  gameWinner,
  winningSet,
  data: { cells, cellsOpen, winner: boardWinner },
  boardIndex,
  onClick,
  activeBoard,
}: Props) => {
  const _onClick = (cellIndex: T.Cell) => {
    onClick({ board: boardIndex, cell: cellIndex });
  };
  const active = !gameWinner && activeBoard.includes(boardIndex);
  const shouldDim = useMemo(
    () => (gameWinner ? !winningSet.includes(boardIndex) : !active),
    [gameWinner, winningSet, boardIndex, active]
  );
  return (
    <NewGrid
      shouldDim={shouldDim}
      shouldFlash={active && flashing}
      boardWinner={boardWinner}
    >
      {cells.map((cell, i) => (
        <Cell
          inPlayableArea={active}
          onClick={_onClick}
          cellType={cell}
          cellIndex={i as T.Cell}
          key={i}
        />
      ))}
    </NewGrid>
  );
};

export default Board;
