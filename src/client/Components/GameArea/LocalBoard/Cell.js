import React from 'react';
import styled from 'styled-components';

import theme from '../../../utils/theme';
import toSymbol from '../../../utils/toSymbol';

const StyledCell = styled.button`
  border: 0;
  font-weight: bold;
  color: ${theme.cellText};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.cellBackground};
  min-width: 2em;
  min-height: 2em;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: ${theme.cellHoverBackground};
  }
`;

const Cell = ({ cellType, cellIndex, onClick, onHover }) => {
  const handleClick = () => void onClick(cellIndex);
  const handleHover = () => void onHover(cellIndex);
  return (
    <StyledCell
      type="button"
      className="cell"
      onClick={handleClick}
      onMouseOver={handleHover}
    >
      {cellType && toSymbol(cellType)}
    </StyledCell>
  );
};

export default Cell;
