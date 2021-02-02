import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Text, Bar } from '../styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const FLASH_DURATION = 500;

const flash = keyframes`
0%, 30% {
  color: black;
}
100% {
  color: inherit;
}
`;

const animation = css`
  animation: ${FLASH_DURATION}ms ${flash};
`;

const Container = styled(Text)`
  height: 2em;
  width: 100%;

  svg {
    margin-left: 0.5em;
  }
`;

const LinkContainer = styled.div`
  max-width: 50%;
  display: flex;
  font-weight: normal;
`;

const CopyToClipboard = styled.div<{ flashing: boolean }>`
  text-align: end;
  max-width: 50%;

  ${({ flashing }) => flashing && animation}

  span {
    white-space: pre;
  }
`;

export default function Share({ room }: { room: string }) {
  const [clicked, setClicked] = useState(false);
  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setClicked(true);

    setTimeout(() => {
      setClicked(false);
    }, FLASH_DURATION);
  };

  return (
    <Bar>
      <Container justify="space-between">
        <LinkContainer>
          u3t.io/game/
          <b>{room}</b>
        </LinkContainer>
        <CopyToClipboard onClick={handleCopy} flashing={clicked}>
          Copy to{' '}
          <span css="white-space: pre;">
            clipboard
            <FontAwesomeIcon icon={faCopy} />
          </span>
        </CopyToClipboard>
      </Container>
    </Bar>
  );
}
