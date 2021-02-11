import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import * as T from '../../../shared/types';

import palette from '../../../utils/palette';
import { boxShadow } from '../../../styles/mixins';

export const getCellBg = (cellType: null | T.Player) => {
  switch (cellType) {
    case 1:
      return palette.red;
    case 2:
      return palette.yellow;
    default:
      return palette.white;
  }
};

export interface Props {
  cellType: null | T.Player;
  size?: string;
  className?: string;
}

const CellContainer = styled.button<Props>`
  border-radius: 4px;
  color: ${palette.primaryLight};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  outline: 0;
  background-color: ${({ cellType }) => getCellBg(cellType)};
  ${({ size }) => size && `width: ${size}; height: ${size};`}
  ${boxShadow}
  && > svg {
    width: 50%;
    height: 50%;
  }
`;

export default function Cell({ ...rest }: Props) {
  return (
    <CellContainer {...rest}>
      {rest.cellType && (
        <FontAwesomeIcon icon={rest.cellType === 1 ? faTimes : faCircle} />
      )}
    </CellContainer>
  );
}
