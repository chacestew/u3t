import React from 'react';

import * as T from '../../../../shared/types';

import Loading from './HeaderContents/Loading';
import Share from './HeaderContents/Share';
import InPlay from './HeaderContents/InPlay';
import Finished from './HeaderContents/Finished';
import Home from './HeaderContents/Home';

export type Mode = 'loading' | 'share' | 'local' | 'online' | 'spectator';

interface Props {
  seat: 1 | 2;
  mode: Mode;
  state: T.IGameState;
  room?: string;
  restartRequested?: boolean;
  onPlayAgainConfirm: () => void;
}

export const Header: React.FC<Props> = ({
  state,
  seat,
  mode,
  room,
  onPlayAgainConfirm,
  restartRequested,
}) => {
  const { currentPlayer, activeBoard, boards } = state;

  switch (mode) {
    case 'loading':
      return <Loading />;
    case 'share':
      return <Share room={room as string} />;
    case 'home':
      return <Home />;
    case 'spectator':
      return (
        <InPlay
          text="You are spectating"
          cell={state.currentPlayer}
          boards={boards}
          activeBoard={activeBoard}
        />
      );
  }

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

  switch (mode) {
    case 'local':
      return <InPlay cell={seat} boards={boards} activeBoard={activeBoard} />;
    case 'online':
      return (
        <InPlay
          text={currentPlayer === seat ? 'You to play' : 'Opponent to play'}
          cell={seat}
          boards={boards}
          activeBoard={activeBoard}
        />
      );
  }
};
