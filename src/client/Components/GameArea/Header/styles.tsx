import styled from 'styled-components';
import palette from '../../../utils/palette';

import BaseCell from '../Cell/Cell';

export const Text = styled.div<{
  fontSize?: string;
  justify?: string;
  opacity?: number;
}>`
  font-size: ${props => props.fontSize || '18px'};
  font-weight: bold;
  display: flex;
  align-items: center;
  // width: 24%;
  opacity: ${({ opacity }) => opacity || 1};
  justify-content: ${({ justify }) => justify};
`;

export const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.gameBarBg};
  padding: 1em;
  color: ${palette.textColor};
  margin-bottom: 10px;
`;

export const Cell = styled(BaseCell)`
  width: 2em;
  height: 2em;
`;
