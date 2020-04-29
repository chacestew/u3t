import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

import palette from '../../../utils/palette';

const bgColor = cellType => {
  switch (cellType) {
    case 1:
      return palette.p1CellBg;
    case 2:
      return palette.p2CellBg;
    default:
      return palette.cellBg;
  }
};

const StyledCell = styled.div`
  border-radius: 4px;
  font-weight: bold;
  color: darkslategrey;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  ${({ cellType, inPlayableArea }) =>
    `background-color: ${bgColor(cellType, inPlayableArea)}
    ${
      !cellType && inPlayableArea
        ? `&:hover {
      background-color: ${palette.cellHoverBg}
    }`
        : ''
    }
    `}
  svg {
    width: 50% !important;
    height: 50% !important;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

export const Cello = ({ type, ...rest }) => (
  <StyledCell cellType={type} {...rest}>
    {type && <FontAwesomeIcon icon={type === 1 ? faTimes : faCircle} />}
  </StyledCell>
);

const Cell = ({ cellType, inPlayableArea, cellIndex, onClick, onHover }) => {
  const handleClick = () => onClick(cellIndex);
  const handleHover = () => onHover(cellIndex);
  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <Cello
      inPlayableArea={inPlayableArea}
      className="cell"
      onClick={handleClick}
      onMouseOver={handleHover}
      type={cellType}
    />
    // <StyledCell
    //   inPlayableArea={inPlayableArea}
    //   className="cell"
    //   onClick={handleClick}
    //   onMouseOver={handleHover}
    //   cellType={cellType}
    // >
    //   {cellType && <FontAwesomeIcon icon={cellType === 1 ? faTimes : faCircle} />}
    // </StyledCell>
  );
};

export default Cell;
