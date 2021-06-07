import React, { useState } from 'react';

import { Cell, Text, Bar } from '../styles';
import { Button } from '../../../Button';

interface PlayAgainProps {
  isOnline?: boolean;
  onPlayAgainConfirm: () => void;
  restartRequested?: boolean;
}

const PlayAgain = ({
  isOnline,
  onPlayAgainConfirm,
  restartRequested,
}: PlayAgainProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const onClick = () => {
    setConfirmed(!confirmed);
    onPlayAgainConfirm();
  };

  return (
    <Text justify="flex-end">
      <Button $shadow $rounded onClick={onClick} disabled={confirmed}>
        Play again? {isOnline && `(${restartRequested || confirmed ? 1 : 0}/2)`}
      </Button>
    </Text>
  );
};

interface Props extends PlayAgainProps {
  winner: 1 | 2 | null;
}

const Finished = ({ isOnline, winner, restartRequested, onPlayAgainConfirm }: Props) => {
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
        isOnline={isOnline}
        onPlayAgainConfirm={onPlayAgainConfirm}
      />
    </Bar>
  );
};

export default Finished;
