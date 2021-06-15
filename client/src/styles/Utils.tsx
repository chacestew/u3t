import styled from 'styled-components';

import { flexColumns } from './mixins';

export const RelativeBox = styled.div`
  ${flexColumns}
  position: relative;
  overflow: hidden;
  flex: 1;
`;
