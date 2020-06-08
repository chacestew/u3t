import React from 'react';
import styled from 'styled-components';
import Cell from '../Cell/Cell';
import palette from '../../../utils/palette';
import * as T from '../../../../shared/types';

const DimmableHoverableCell = styled(Cell)<Props>`
  ${({ shouldDim }) => shouldDim && `opacity: 0.5;`}
  ${({ cellType, inPlayableArea }) =>
    !cellType &&
    inPlayableArea &&
    `@media (hover: hover) {
      &:hover {
       background-color: ${palette.cellHoverBg}
      }
    }
  `}
`;

interface Props {
  cellType: null | T.Player;
  inPlayableArea: boolean;
  cellIndex?: T.Cell;
  onClick: any;
  shouldDim: boolean;
}

const InteractiveCell = ({
  cellType,
  inPlayableArea,
  cellIndex,
  onClick,
  shouldDim,
}: Props) => {
  const handleClick = () => onClick(cellIndex);
  return (
    <DimmableHoverableCell
      shouldDim={shouldDim}
      inPlayableArea={inPlayableArea}
      onClick={handleClick}
      cellType={cellType}
    />
  );
};

export default InteractiveCell;
