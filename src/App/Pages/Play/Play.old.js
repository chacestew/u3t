import React from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

import Game, { initialState } from '../../../../game';

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
    {data.cells.map((cell, i) => (
      <Cell onClick={onClick} cellType={cell} cellIndex={[boardIndex, i]} key={i} />
    ))}
  </Grid>
);

class GameView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seat: null, game: initialState, room: null };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = io();

    // const {
    //   match: {
    //     params: { room },
    //   },
    // } = this.state;

    if (false) {
      this.socket.emit('joinGame', { room });
    } else {
      this.socket.emit('createGame');
    }

    this.socket.on('gameCreated', () => {
      console.log('game?', this.game);
      this.game = new Game({ playerOne: this.socket.id });
      this.setState({ seat: 0, game: this.game.getState() });
    });

    this.socket.on('gameJoined', () => {
      this.game = new Game({ playerTwo: this.socket.id });
      this.setState({ seat: 1, game: this.game.getState() });
    });

    this.socket.on('update', data => {
      this.game.sync(data.state);
      this.setState(this.game.getState());
    });
  }

  onClick = ([board, cell]) => {
    const nextState = this.game.playTurn(
      { player: this.socket.id, board, cell },
      nextState => this.setState(nextState)
    );
    this.setState(nextState);
    this.socket.emit('playTurn', { board, cell });
  };

  render() {
    const {
      game: { turn, boards, activeBoard, winner },
    } = this.state;
    console.log(this.state);
    return (
      <>
        {`Turn: ${turn}`}
        <Grid style={{ width: '600px', height: '600px' }}>
          {boards.map((b, i) => (
            <Board
              data={b}
              boardIndex={i}
              currentBoard={activeBoard}
              key={i}
              onClick={this.onClick}
            />
          ))}
        </Grid>
        {winner && `Winner: ${winner}`}
      </>
    );
  }
}

export default GameView;
