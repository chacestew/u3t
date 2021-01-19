import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import * as T from '../../../shared/types';

import palette from '../../../utils/palette';

const getCellBg = (cellType: null | T.Player) => {
  switch (cellType) {
    case 1:
      return palette.p1CellBg;
    case 2:
      return palette.p2CellBg;
    default:
      return palette.cellBg;
  }
};

export interface Props {
  cellType: null | T.Player;
  size?: string;
  className?: string;
}

const CellContainer = styled.div<Props>`
  border-radius: 4px;
  font-weight: bold;
  color: ${palette.gameBarBg};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  background-color: ${({ cellType }) => getCellBg(cellType)};
  ${({ size }) => size && `width: ${size}; height: ${size};`}
  svg {
    width: 50% !important;
    height: 50% !important;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const Cell = ({ ...rest }: Props) => {
  return (
    <CellContainer {...rest}>
      {rest.cellType && (
        <FontAwesomeIcon icon={rest.cellType === 1 ? faTimes : faCircle} />
      )}
    </CellContainer>
  );
};

export default Cell;
