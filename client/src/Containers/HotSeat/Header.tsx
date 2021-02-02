import React from 'react';

import * as T from '../../shared/types';

import InPlay from '../../Components/GameArea/Header/HeaderContents/InPlay';
import Finished from '../../Components/GameArea/Header/HeaderContents/Finished';

export type Mode = 'home' | 'loading' | 'share' | 'local' | 'online' | 'spectator';

interface Props {
  seat: 1 | 2;
  mode: Mode;
  state: T.IGameState;
  room?: string;
  restartRequested?: boolean;
  onPlayAgainConfirm: () => void;
}

export default function LocalHeader({
  state,
  mode,
  onPlayAgainConfirm,
  restartRequested,
}: Props) {
  if (state.finished) {
    return (
      <Finished
        winner={state.winner}
        mode={mode}
        onPlayAgainConfirm={onPlayAgainConfirm}
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
