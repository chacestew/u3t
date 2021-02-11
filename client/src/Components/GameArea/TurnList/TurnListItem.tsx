import React, { memo } from 'react';
import * as T from '../../../shared/types';
import BaseCell from '../Cell/Cell';
import BoardSVG from '../BoardSVG';
import styled from 'styled-components';
import { media } from '../../../styles/mixins';

export const TurnListParagraph = styled.p`
  padding: 0.5em;
  font-weight: normal;
`;

export const TurnListCell = styled(BaseCell).attrs({ forwardedAs: 'span' })`
  width: 1.5em;
  height: 1.5em;
  margin: 0em 0.25em;
  box-shadow: none;
`;

export const StyledTurnListItem = styled.div`
  display: flex;
  align-items: baseline;
`;

const Board = styled(BoardSVG)`
  vertical-align: bottom;
  margin: 0em 0.25em;
`;

const TurnListBoardIcon = memo(({ index }: { index: T.Cell }) => {
  const getPathAttributes = (i: number) => ({
    fill: 'white',
    fillOpacity: i === index ? 1 : 0.5,
  });

  return <Board size="1.5em" getPathAttributes={getPathAttributes} />;
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
    <TurnListParagraph>
      #{turn + 1} <TurnListCell cellType={player} /> chose cell <b>{cell + 1}</b>{' '}
      <TurnListBoardIcon index={cell} /> on board <b>{board + 1}</b>{' '}
      <TurnListBoardIcon index={board} />
    </TurnListParagraph>
  </StyledTurnListItem>
);

export default TurnListItem;
