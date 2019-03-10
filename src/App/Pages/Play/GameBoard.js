import React from 'react';
import styled from 'styled-components';

/* eslint-disable */
const startingState = [
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
];
/* eslint-enable */

const Grid = styled.div`
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);

  .cell {
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Cell = ({ cellType, cellIndex, onClick }) => (
  <button
    type="button"
    onClick={() => {
      onClick(cellIndex);
    }}
    className="cell"
  >
    {cellType || ' '}
  </button>
);

const Board = ({ data, boardIndex, onClick, activeBoard }) => {
  const _onClick = cellIndex => {
    onClick({ board: boardIndex, cell: cellIndex });
  };
  return (
    <Grid style={{ border: `2px solid ${activeBoard === boardIndex ? 'red' : 'blue'}` }}>
      {data.cells.map((cell, i) => (
        <Cell onClick={_onClick} cellType={cell} cellIndex={i} key={i} />
      ))}
    </Grid>
  );
};

const GameView = ({ state, playTurn }) => {
  const { turn, boards, activeBoard, winner } = state;

  return (
    <>
      {`Turn: ${turn}`}
      <Grid style={{ width: '600px', height: '600px' }}>
        {boards.map((b, i) => (
          <Board
            data={b}
            boardIndex={i}
            activeBoard={activeBoard}
            key={i}
            onClick={playTurn}
          />
        ))}
      </Grid>
      {winner && `Winner: ${winner}`}
    </>
  );
};

export default GameView;
