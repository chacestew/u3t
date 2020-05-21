import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import * as T from '../../../../shared/types';

import palette from '../../../utils/palette';

const bgColor = (cellType: null | T.Player) => {
  switch (cellType) {
    case 1:
      return palette.p1CellBg;
    case 2:
      return palette.p2CellBg;
    default:
      return palette.cellBg;
  }
};

interface Props {
  cellType: null | T.Player;
  inPlayableArea: boolean;
  cellIndex?: T.Cell;
  onClick: any;
}

const StyledCell = styled.div<StaticProps>`
  border-radius: 4px;
  font-weight: bold;
  color: darkslategrey;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  background-color: ${({ cellType }) => bgColor(cellType)};
  ${({ cellType, inPlayableArea }) =>
    !cellType &&
    inPlayableArea &&
    `@media (hover: hover) {
      &:hover {
       background-color: ${palette.cellHoverBg}
      }
    }
  `}
  svg {
    width: 50% !important;
    height: 50% !important;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

interface StaticProps {
  cellType: null | T.Player;
  inPlayableArea?: boolean;
  className?: string;
  onClick?: any;
}

export const StaticCell = ({ ...rest }: StaticProps) => (
  <StyledCell {...rest}>
    {rest.cellType && <FontAwesomeIcon icon={rest.cellType === 1 ? faTimes : faCircle} />}
  </StyledCell>
);

const Cell = ({ cellType, inPlayableArea, cellIndex, onClick }: Props) => {
  const handleClick = () => onClick(cellIndex);
  return (
    <StaticCell
      inPlayableArea={inPlayableArea}
      className="cell"
      onClick={handleClick}
      cellType={cellType}
    />
  );
};

export default Cell;
