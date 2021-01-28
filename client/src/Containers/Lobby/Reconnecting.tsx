import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import palette from '../../utils/palette';

const StyledReconnecting = styled.div`
  position: absolute;
  margin: 0px;
  padding: 1em;
  border-radius: 4px;
  background-color: ${palette.primaryLight};
  color: ${palette.white};
  z-index: 2;
  font-weight: bold;

  svg {
    margin-left: 0.5em;
  }

  span {
    animation: dc-ldr 1.2s ease infinite;
  }

  @keyframes dc-ldr {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const Reconnecting = () => (
  <StyledReconnecting>
    <span>
      Reconnecting <FontAwesomeIcon icon={faCloud} />
    </span>
  </StyledReconnecting>
);
