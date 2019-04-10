import React from 'react';
import styled from 'styled-components';

import theme from '../../../shared/theme';
import toSymbol from '../../../shared/toSymbol';

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
    outline: 1px solid;
  }
`;

const Cell = ({ cellType, cellIndex, onClick }) => (
  <StyledCell
    type="button"
    onClick={() => {
      onClick(cellIndex);
    }}
    className="cell"
  >
    {cellType && toSymbol(cellType)}
  </StyledCell>
);

export default Cell;
