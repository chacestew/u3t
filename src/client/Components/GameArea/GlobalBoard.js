import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '../Grid';

import Board from './LocalBoard/LocalBoard';
import Timer from './TurnTimer';
import { Cello } from './LocalBoard/Cell';
import palette from '../../utils/palette';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.gameBarBg};
  padding: 1em;
  color: ${palette.textColor};
  margin-bottom: 10px;
`;

const Header = ({ turn, turnStartTime, seat }) => {
  return (
    <Bar>
      <span>
        You are {console.log('UGH', seat)}
        <Cello type={seat} />
      </span>
      <span>
        <b>Player {turn % 2 ? 'X' : 'O'}'s turn</b>
      </span>
      {/* <Timer turnStartTime={turnStartTime} /> */}
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

const GameView = ({
  flashing,
  state,
  playTurn,
  turnStartTime,
  status,
  seat,
  onFinish = () => {},
}) => {
  const { turn, boards, activeBoard, winner, winningSet } = state;
  const [nextBoardHover, setNextBoardHover] = useState(null);
  useEffect(() => {
    if (state.winner || state.tied) {
      onFinish();
    }
  }, [state.winner, state.tied]);
  const onHover = cellIndex => setNextBoardHover(cellIndex);

  return (
    <Container>
      <Header seat={seat} turn={turn} turnStartTime={turnStartTime} />
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
            flashing={i === flashing}
            gameWinner={winner}
            winningSet={winningSet}
            data={b}
            boardIndex={i}
            activeBoard={activeBoard}
            potentialBoard={nextBoardHover === i}
            key={i} // eslint-disable-line react/no-array-index-key
            onHover={onHover}
            onClick={playTurn}
          />
        ))}
      </Grid>
      <Status status={status} />
    </Container>
  );
};

export default GameView;
