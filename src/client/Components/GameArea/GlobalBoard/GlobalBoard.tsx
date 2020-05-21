import React, { useState, useEffect } from 'react';
import Grid from '../../Grid';

import Board from '../LocalBoard/LocalBoard';
import { isInvalidTurn } from '../../../../shared/game';
import * as T from '../../../../shared/types';
import { Header, ShareHeader, Loading } from './Header';

interface Props {
  state: T.IGameState;
  status?: string;
  seat: null | T.Player;
  onValidTurn: (turnInput: T.ITurnInput) => void;
  onInvalidTurn: (error: T.Errors) => void;
  onFinish: () => void;
}

const GameView = ({
  loading,
  shareLink,
  state,
  status,
  seat,
  onValidTurn,
  onInvalidTurn,
  doNotValidate,
  onPlayAgainConfirm = () => {},
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
    <div>
      <Header seat={seat} turn={turn}>
        {loading ? <Loading /> : shareLink ? <ShareHeader /> : undefined}
      </Header>
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
      <div
        css={`
          display: flex;
          width: 100%;
          height: 100%;
          margin-top: 5px;
          // margin-bottom: 4px;
        `}
      >
        <div
          css={`
            // border-radius: 4px;
            background: silver;
          `}
        ></div>
      </div>
      {false && (
        <PlayAgainBoard
          winner={state.winner}
          seat={seat}
          onConfirm={onPlayAgainConfirm}
        />
      )}
    </div>
  );
};

const PlayAgainBoard = ({ winner, seat, onConfirm }) => (
  <div onClick={onConfirm}>{winner === seat ? 'You won! ' : 'You lost.'} Play again?</div>
);

export default GameView;
