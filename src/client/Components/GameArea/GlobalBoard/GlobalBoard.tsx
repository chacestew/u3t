import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../../Grid';

import Board from '../LocalBoard/LocalBoard';
import { isInvalidTurn } from '../../../../shared/game';
import * as T from '../../../../shared/types';
import { Header, ShareHeader, Loading } from '../Header/Header';
import { gridSize } from '../../../utils/palette';
import TurnList from '../TurnList/TurnList';
import { flexColumns } from '../../../styles/mixins';

interface Props {
  state: T.IGameState;
  status?: string;
  seat: null | T.Player;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn: (error: T.Errors) => void;
  onFinish: () => void;
}

const Container = styled.div`
  ${flexColumns}
  flex: 1;
  overflow: hidden;
`;

const OuterGrid = styled(Grid)`
  width: 100vw;
  height: 100vw;
  max-width: ${gridSize};
  max-height: ${gridSize};
`;

const GameView = ({
  loading,
  shareLink,
  state,
  turnList,
  status,
  seat,
  onValidTurn,
  onInvalidTurn,
  doNotValidate,
  onRestartGame,
  onPlayAgainConfirm = () => {},
  onFinish = () => {},
}: Props) => {
  const { turn, boards, activeBoard, winner, winningSet, currentPlayer } = state;
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (state.winner || state.tied) {
      onFinish();
    }
  }, [state.winner, state.tied]);

  const onPlay = (turnInput: T.ITurnInput) => {
    const invalidTurnError = isInvalidTurn(state, { player: seat, ...turnInput });
    if (!doNotValidate && invalidTurnError) {
      onInvalidTurn && onInvalidTurn(invalidTurnError);
      if (invalidTurnError === T.Errors.BoardNotPlayable) {
        if (flashing) return;
        setFlashing(true);
        setTimeout(() => {
          setFlashing(false);
        }, 350);
      }
    } else {
      onValidTurn(turnInput);
    }
  };

  return (
    <Container>
      <Header
        seat={seat}
        currentPlayer={currentPlayer}
        activeBoard={activeBoard}
        boards={boards}
      >
        {loading ? <Loading /> : shareLink ? <ShareHeader /> : undefined}
      </Header>
      <OuterGrid>
        {boards.map((b, i) => (
          <Board
            flashing={flashing}
            gameWinner={winner}
            winningSet={winningSet}
            data={b}
            boardIndex={i as T.Cell}
            activeBoard={activeBoard}
            key={i}
            onClick={onPlay}
          />
        ))}
      </OuterGrid>
      <TurnList turnList={turnList} />
    </Container>
  );
};

export default GameView;
