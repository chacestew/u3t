import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../../Grid';

import Board from '../LocalBoard/LocalBoard';
import { isInvalidTurn } from '../../../shared/game';
import * as T from '../../../shared/types';
import { gridSize } from '../../../utils/palette';
import Modal from '../../Modal';

interface Props {
  state: T.IGameState;
  seat: null | T.Player;
  error?: T.ErrorParams | null;
  dismissError?: () => void;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn?: (error: T.Errors) => void;
  Alert?: false | React.ReactElement;
  disabled?: boolean;
  Modal?: React.ReactElement | null;
}

const Container = styled.div`
  position: relative;
`;

const OuterGrid = styled(Grid)<{ disabled?: boolean }>`
  width: 100vw;
  height: 100vw;
  max-width: ${gridSize};
  max-height: ${gridSize};

  ${(props) =>
    props.disabled &&
    `
      pointer-events: none; 
      opacity: 0.6;
    `}
`;

export default function GameView({
  state,
  seat,
  onValidTurn,
  onInvalidTurn,
  Modal,
  Alert,
  disabled,
}: Props) {
  const { boards, activeBoard, winner, winningSet } = state;
  const [flashing, setFlashing] = useState(false);

  const onPlay = (turnInput: { board: T.Board; cell: T.Cell }) => {
    if (disabled) return;
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
    <Container>
      {Modal && Modal}
      {Alert && Alert}
      <OuterGrid disabled={disabled}>
        {boards.map((b, i) => (
          <Board
            seat={seat!}
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
    </Container>
  );
}
