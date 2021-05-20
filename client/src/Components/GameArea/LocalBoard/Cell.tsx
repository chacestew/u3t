import React from 'react';
import styled from 'styled-components';
import Cell from '../Cell/Cell';
import palette from '../../../utils/palette';
import { Cell as CellType, Player } from '../../../shared/types';

const DimmableHoverableCell = styled(Cell)<Partial<Props>>`
  ${({ shouldDim }) => shouldDim && `opacity: 0.5;`}
  ${({ cellType, inPlayableArea }) =>
    !cellType &&
    inPlayableArea &&
    `@media (hover: hover) {
      &:hover {
       background-color: ${palette.primaryLight}
      }
    }
  `}
`;

interface Props {
  cellType: null | Player;
  inPlayableArea: boolean;
  cellIndex: CellType;
  onClick: (cellIndex: CellType) => void;
  shouldDim: boolean;
}

const InteractiveCell = ({
  cellType,
  inPlayableArea,
  cellIndex,
  onClick,
  shouldDim,
}: Props) => {
  function handleClick() {
    onClick(cellIndex);
  }
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
