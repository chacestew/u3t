import React from 'react';
import styled from 'styled-components';

import { Button } from '../../Button';

interface Props {
  onClick: () => void;
  text: string;
  icon: JSX.Element;
}

const StyledButton = styled(Button)`
  :hover {
    filter: none;
  }
  & > svg {
    margin-left: 0.5em;
  }
`;

export default function RestartButton({ onClick, text, icon }: Props) {
  return (
    <StyledButton shadow={false} onClick={onClick}>
      {text}
      {icon}
    </StyledButton>
  );
}
