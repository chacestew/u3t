import React from 'react';

import { IGameState } from '@u3t/common';

import InPlay from './HeaderContents/InPlay';
import Finished from './HeaderContents/Finished';

interface Props {
  seat: 1 | 2;
  state: IGameState;
  lobbyId?: string;
  restartRequested?: boolean;
  onPlayAgainConfirm: () => void;
  isOnline?: boolean;
}

export default function LocalHeader({
  state,
  onPlayAgainConfirm,
  restartRequested,
  isOnline,
}: Props) {
  if (state.finished) {
    return (
      <Finished
        winner={state.winner}
        onPlayAgainConfirm={onPlayAgainConfirm}
        isOnline={isOnline}
        restartRequested={restartRequested}
      />
    );
  }

  return (
    <InPlay
      cell={state.currentPlayer}
      boards={state.boards}
      activeBoard={state.activeBoard}
    />
  );
}
