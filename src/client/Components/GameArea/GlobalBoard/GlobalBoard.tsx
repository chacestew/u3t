import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../../Grid';

import Board from '../LocalBoard/LocalBoard';
import { isInvalidTurn } from '../../../../shared/game';
import * as T from '../../../../shared/types';
import palette, { gridSize } from '../../../utils/palette';
import Modal from '../../Modal';

interface Props {
  state: T.IGameState;
  seat: null | T.Player;
  error: T.ErrorParams | null;
  dismissError: () => void;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn?: (error: T.Errors) => void;
}

const OuterGrid = styled(Grid)`
  width: 100vw;
  height: 100vw;
  max-width: ${gridSize};
  max-height: ${gridSize};
`;

const GameView = ({
  state,
  seat,
  onValidTurn,
  onInvalidTurn,
  error,
  dismissError,
}: Props) => {
  const { turn, boards, activeBoard, winner, winningSet, currentPlayer } = state;
  const [flashing, setFlashing] = useState(false);

  const onPlay = (turnInput: { board: T.Board; cell: T.Cell }) => {
    const turn = { player: seat!, ...turnInput };
    const invalidTurnError = isInvalidTurn(state, turn);
    if (invalidTurnError) {
      onInvalidTurn && onInvalidTurn(invalidTurnError);
      if (invalidTurnError === T.Errors.BoardNotPlayable) {
        if (flashing) return;
        setFlashing(true);
        setTimeout(() => {
          setFlashing(false);
        }, 350);
      }
    } else {
      onValidTurn(turn);
    }
  };

  return (
    <div css="position: relative;">
      {error && <Modal error={error} dismissError={dismissError} />}
      <OuterGrid>
        {boards.map((b, i) => (
          <Board
            key={i}
            data={b}
            flashing={flashing}
            gameWinner={winner}
            winningSet={winningSet}
            boardIndex={i as T.Cell}
            activeBoard={activeBoard}
            onClick={onPlay}
          />
        ))}
      </OuterGrid>
    </div>
  );
};

export default GameView;
