import React, { useCallback } from 'react';
import * as T from '../../../shared/types';
import BaseCell from '../Cell/Cell';
import BoardSVG from '../BoardSVG';
import styled from 'styled-components';
import { media } from '../../../styles/mixins';

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
`;

const TurnListBoardIcon = React.memo(({ index }: { index: T.Cell }) => {
  const getPathAttributes = (i: number) => ({
    fill: 'white',
    fillOpacity: i === index ? 1 : 0.5,
  });

  return (
    <BoardSVG className="element" size="1.5em" getPathAttributes={getPathAttributes} />
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
      className="element"
      css={`
         {
          opacity: 0.5;
          font-weight: normal;
        }
      `}
    >
      {turn + 1}
    </span>
    <div
      css={`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      `}
    >
      <Cell className="element" cellType={player} />
      <span className="element">played on board</span>
      <TurnListBoardIcon index={board} />
      <span className="element">and cell</span>
      <TurnListBoardIcon index={cell} />
    </div>
  </StyledTurnListItem>
);

export default TurnListItem;
