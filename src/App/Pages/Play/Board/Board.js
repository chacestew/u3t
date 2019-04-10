import React from 'react';
import styled from 'styled-components';

import Grid from '../Grid';
import Cell from './Cell';
import theme from '../../../shared/theme';
import toSymbol from '../../../shared/toSymbol';

const winnerStyles = ({ winner }) =>
  winner &&
  `
opacity: 0.5;
&:before {
content: '${winner}';
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
font-size: 7.1em;
}`;

const NewGrid = styled(Grid).attrs(props => ({
  winner: props.winner && toSymbol(props.winner),
}))`
  grid-gap: 4px;
  border: 4px solid ${theme.boardBorder};
  padding: 0;
  border-radius: 6px;
  background: ${theme.boardBorder};
  ${props => props.active && `box-shadow: 0 0 0 2px ${theme.boardActiveOutline};`}
  ${winnerStyles}
`;

const Board = ({
  data: { cells, cellsOpen, winner },
  boardIndex,
  onClick,
  activeBoard,
}) => {
  const _onClick = cellIndex => {
    onClick({ board: boardIndex, cell: cellIndex });
  };
  const active =
    (cellsOpen && !winner && activeBoard === null) || activeBoard === boardIndex;
  return (
    <NewGrid active={active} winner={winner}>
      {cells.map((cell, i) => (
        <Cell onClick={_onClick} cellType={cell} cellIndex={i} key={i} />
      ))}
    </NewGrid>
  );
};

export default Board;
