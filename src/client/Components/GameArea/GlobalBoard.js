import React, { useState } from 'react';
import styled from 'styled-components';
import Grid from '../Grid';

import Board from './LocalBoard/LocalBoard';
import Timer from './TurnTimer';

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: hotpink;
  padding: 1em;
  color: white;
  margin-bottom: 10px;
  border-radius: 0 0 10px 10px;
`;

const Header = ({ turn, turnStartTime }) => {
  const a = 'a';
  return (
    <Bar>
      <span>
        <b>Player X's turn</b>
      </span>
      <span>
        <b>#</b> {turn}
      </span>
      <Timer turnStartTime={turnStartTime} />
    </Bar>
  );
};

const Status = ({ status = 'Chose wrong board.' }) => {
  const a = 'a';
  return (
    <div css="margin-top: 10px">
      <b>Status:</b> {status}
    </div>
  );
};

const Container = styled.div``;

const GameView = ({ state, playTurn, turnStartTime, status }) => {
  const { turn, boards, activeBoard, winner, winningSet } = state;
  const [nextBoardHover, setNextBoardHover] = useState(null);
  const onHover = cellIndex => setNextBoardHover(cellIndex);
  return (
    <Container>
      <Header turn={turn} turnStartTime={turnStartTime} />
      <Grid
        css={`
          width: 100vw;
          height: 100vw;
          max-width: 800px;
          max-height: 800px;
        `}
      >
        {boards.map((b, i) => (
          <Board
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
