import styled from 'styled-components';
import palette from '../utils/palette';

const Grid = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  position: relative;
`;

export default Grid;
