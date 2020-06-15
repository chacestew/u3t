import React, { useState } from 'react';
import styled from 'styled-components';

import { Cell, Text, Bar } from '../styles';
import { Mode } from '../Header';
import palette from '../../../../utils/palette';

const Button = styled.button<{ disabled: boolean; isOnline: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#dddeda' : 'white')};
  border-radius: 4px;
  height: 2em;
  padding: 0 0.5em;
  font-weight: bold;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  border: 0;
  color: ${palette.gameBarBg};
  ${({ isOnline }) => isOnline && 'margin-right: 0.5em;'}
`;

interface PlayAgainProps {
  mode: Mode;
  onPlayAgainConfirm: () => void;
  restartRequested?: boolean;
}

const PlayAgain = ({ mode, onPlayAgainConfirm, restartRequested }: PlayAgainProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const onClick = () => {
    setConfirmed(!confirmed);
    onPlayAgainConfirm();
  };

  const isOnline = mode === 'online';
  return (
    <Text justify="flex-end">
      <Button onClick={onClick} disabled={confirmed} isOnline={isOnline}>
        Play again?
      </Button>
      {isOnline && `(${restartRequested || confirmed ? 1 : 0}/2)`}
    </Text>
  );
};

interface Props extends PlayAgainProps {
  winner: 1 | 2 | null;
}

const Finished = ({ winner, mode, restartRequested, onPlayAgainConfirm }: Props) => {
  return (
    <Bar>
      <Text justify="flex-start">
        {winner ? (
          <>
            <Cell css="margin-right: 0.5em;" cellType={winner} />
            wins!
          </>
        ) : (
          'Stalemate!'
        )}
      </Text>
      <PlayAgain
        restartRequested={restartRequested}
        mode={mode}
        onPlayAgainConfirm={onPlayAgainConfirm}
      />
    </Bar>
  );
};

export default Finished;
