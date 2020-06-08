import React, { useCallback } from 'react';
import * as T from '../../../../shared/types';
import BaseCell from '../Cell/Cell';
import BoardSVG from '../Header/BoardSVG';
import styled from 'styled-components';

const Cell = styled(BaseCell)`
  width: 1.5em;
  height: 1.5em;
  margin: 0.25em;

  svg {
    width: 60% !important;
    height: 60% !important;
  }
`;

const StyledTurnListItem = styled.div`
  display: flex;
  align-items: baseline;

  span .board-icon {
  }
`;

const TurnListBoardIcon = React.memo(({ index }: { index: T.Cell }) => {
  const getPathAttributes = (i: number) => ({
    fill: 'white',
    fillOpacity: i === index ? 1 : 0.5,
  });

  return (
    <BoardSVG
      css={`
        margin: 0.25em;
      `}
      size="1.5em"
      getPathAttributes={getPathAttributes}
    />
  );
});

const TurnListItem = ({
  turn,
  player,
  board,
  cell,
}: {
  turn: number;
  player: T.Player;
  board: T.Board;
  cell: T.Cell;
}) => (
  <StyledTurnListItem>
    <span
      css={`
         {
          margin-left: 0.5em;
          margin-right: 0.25em;
          min-width: 1em;
          opacity: 0.5;
          font-weight: normal;
        }
      `}
    >
      {turn + 1}
    </span>
    <div
      css={`
        margin: 0.25em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      `}
    >
      <Cell cellType={player} />
      <span
        css={`
          margin: 0.25em;
        `}
      >
        played on board
      </span>
      <TurnListBoardIcon index={board} />
      <span
        css={`
          margin: 0.25em;
        `}
      >
        and cell
      </span>
      <TurnListBoardIcon index={cell} />
    </div>
  </StyledTurnListItem>
);

export default TurnListItem;
