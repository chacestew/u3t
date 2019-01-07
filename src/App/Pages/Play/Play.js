import React from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import BigEmoji from '../../Common/BigEmoji';

const game = require('../../../../game.mjs').Game;

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

const Board = ({ data, boardIndex, onClick, currentBoard }) => (
  <Grid style={{ border: `2px solid ${currentBoard === boardIndex ? 'red' : 'blue'}` }}>
    {data.map((cell, i) => (
      <Cell onClick={onClick} cellType={cell} cellIndex={[boardIndex, i]} key={i} />
    ))}
  </Grid>
);

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { room: null, game: { turn: 0, data: startingState, currentBoard: 4 } };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io();

    this.socket.on('gameCreated', data => {
      this.setState({ room: data.room, state: data.state });
    });

    this.socket.on('started');

    if (this.props.match.params.room) {
      this.socket.emit('joinGame', { id: this.props.match.params.room });
    } else {
      this.socket.emit('createGame');
    }
  }

  onClick = ([boardIndex, cellIndex]) => {
    const item = this.state.game.data[boardIndex][cellIndex];
    const currentBoard = this.state.game.currentBoard;
    if (item !== null || (currentBoard !== null && boardIndex !== currentBoard)) {
      console.log('Already occupied!');
      return;
    }
    this.setState(state => {
      const newData = state.game.data;
      newData[boardIndex][cellIndex] = state.game.turn % 2 ? 'O' : 'X';
      const boardNotYetFull = newData[boardIndex].some(e => e === null);
      return {
        data: newData,
        turn: state.game.turn + 1,
        currentBoard: boardNotYetFull ? cellIndex : null,
      };
    });
  };

  render() {
    const {
      game: { data, currentBoard },
    } = this.state;
    return (
      <Grid style={{ width: '600px', height: '600px' }}>
        {data.map((boardData, i) => (
          <Board
            data={boardData}
            boardIndex={i}
            currentBoard={currentBoard}
            key={i}
            onClick={this.onClick}
          />
        ))}
      </Grid>
    );
  }
}

export default Game;
