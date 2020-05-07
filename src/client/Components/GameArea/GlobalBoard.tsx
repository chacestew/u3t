import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../Grid';

import Board from './LocalBoard/LocalBoard';
import { StaticCell } from './LocalBoard/Cell';
import palette from '../../utils/palette';
import { isInvalidTurn } from '../../../shared/game';
import * as T from '../../../shared/types';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.gameBarBg};
  padding: 1em;
  color: ${palette.textColor};
  margin-bottom: 10px;
`;

const NewCell = styled(StaticCell)`
  margin-left: 10px;
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

const Header = ({ turn, seat }: { turn: number; seat: null | T.Player }) => {
  return (
    <Bar>
      <div
        css={`
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: baseline;
        `}
      >
        You are <NewCell cellType={seat} />
      </div>
      <span
        css={`
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: baseline;
        `}
      >
        <NewCell cellType={turn % 2 ? 1 : 2} /> to play
      </span>
    </Bar>
  );
};

const Status = ({ status = '' }) => {
  const a = 'a';
  return (
    <div css="margin-top: 10px">
      <b>Status:</b> {status}
    </div>
  );
};

const Container = styled.div``;

interface Props {
  state: T.IGameState;
  status?: string;
  seat: null | T.Player;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn: (error: T.Errors) => void;
  onFinish: () => void;
}

const GameView = ({
  state,
  status,
  seat,
  onValidTurn,
  onInvalidTurn,
  doNotValidate,
  onFinish = () => {},
}: Props) => {
  const { turn, boards, activeBoard, winner, winningSet } = state;
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (state.winner || state.tied) {
      onFinish();
    }
  }, [state.winner, state.tied]);

  const onPlay = (turnInput: T.ITurnInput) => {
    if (flashing) return;
    const invalidTurnError = isInvalidTurn(state, { player: seat, ...turnInput });
    if (!doNotValidate && invalidTurnError) {
      onInvalidTurn && onInvalidTurn(invalidTurnError);
      if (invalidTurnError === T.Errors.BoardNotPlayable) {
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
      <Header seat={seat} turn={turn} />
      <Grid
        css={`
          width: 100vw;
          height: 100vw;
          max-width: 640px;
          max-height: 640px;
        `}
      >
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
      </Grid>
      <Status status={status} />
    </Container>
  );
};

export default GameView;
