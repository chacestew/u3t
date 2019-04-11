import styled from 'styled-components';
import theme from '../../shared/theme';

const Grid = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  padding: 6px;
  grid-gap: 6px;
  position: relative;
  color: #fff;
  background-color: ${theme.cellBackground};
  border-radius: 10px;
`;

export default Grid;
