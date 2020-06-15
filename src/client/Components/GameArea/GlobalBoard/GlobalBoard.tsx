import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../../Grid';

import Board from '../LocalBoard/LocalBoard';
import { isInvalidTurn } from '../../../../shared/game';
import * as T from '../../../../shared/types';
import { gridSize } from '../../../utils/palette';

interface Props {
  state: T.IGameState;
  seat: null | T.Player;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn?: (error: T.Errors) => void;
}

const OuterGrid = styled(Grid)`
  width: 100vw;
  height: 100vw;
  max-width: ${gridSize};
  max-height: ${gridSize};
`;

const GameView = ({ state, seat, onValidTurn, onInvalidTurn }: Props) => {
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
  );
};

export default GameView;
