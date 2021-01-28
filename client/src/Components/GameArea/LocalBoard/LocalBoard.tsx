import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import Grid from '../../Grid';
import Cell from './Cell';
import palette from '../../../utils/palette';
import * as T from '../../../shared/types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { media } from '../../../styles/mixins';

const InnerGrid = styled(Grid)`
  grid-gap: 4px;
  border-style: solid;
  border-color: ${palette.primaryLight};
  border-width: 0 4px 4px 0;
  padding: 6px;

  ${media.aboveMobileS`grid-gap: 6px; padding: 8px;`}

  &:nth-child(3n) {
    border-right: 0;
  }
  &:nth-child(n + 7) {
    border-bottom: 0;
  }
  &.flashing {
    background-color: skyblue;
  }
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
  data: { cells, winner: boardWinner },
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
    <InnerGrid className={active && flashing ? 'flashing' : undefined}>
      {boardWinner && (
        <FontAwesomeIcon
          color={palette.primaryLight}
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '50%',
            left: '50%',
            marginTop: '-40%',
            marginLeft: '-40%',
            zIndex: 1,
          }}
          icon={boardWinner === 1 ? faTimes : faCircle}
        />
      )}
      {cells.map((cell, i) => (
        <Cell
          shouldDim={shouldDim}
          inPlayableArea={active}
          onClick={_onClick}
          cellType={cell}
          cellIndex={i as T.Cell}
          key={i}
        />
      ))}
    </InnerGrid>
  );
};

export default Board;
