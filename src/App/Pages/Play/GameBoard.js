import React from 'react';
import styled from 'styled-components';
import Grid from './Grid';

import Board from './Board/Board';
import Timer from './Board/Timer';

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
  return (
    <Container>
      <Header turn={turn} turnStartTime={turnStartTime} />
      <Grid>
        {boards.map((b, i) => (
          <Board
            gameWinner={winner}
            winningSet={winningSet}
            data={b}
            boardIndex={i}
            activeBoard={activeBoard}
            key={i} // eslint-disable-line react/no-array-index-key
            onClick={playTurn}
          />
        ))}
      </Grid>
      <Status status={status} />
    </Container>
  );
};

export default GameView;
