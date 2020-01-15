import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';

const socket = io('/coordinator');

const Article = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LineTitle = styled.h2`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:before,
  &:after {
    content: '';
    border-top: 2px solid;
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  &:after {
    margin: 0 0 0 20px;
  }
`;

export default ({ history }) => {
  useEffect(() => {
    socket.on('lobby-ready', ({ id }) => {
      history.replace(`/play/${id}`);
    });

    return () => {
      socket.close();
    };
  }, [history]);

  const makeLobby = () => {
    socket.emit('create-lobby');
  };

  const findGame = () => {
    socket.emit('join-queue');
  };

  return (
    <Article
      css={`
        width: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <h1>Ultimate Tic-Tac-Toe</h1>
      <LineTitle>Test</LineTitle>
      <section>
        <Link to="/hotseat">
          <button type="button">Play a friend</button>
        </Link>
        <button type="button" onClick={makeLobby}>
          Make lobby
        </button>
        <button type="button" onClick={findGame}>
          Find game
        </button>
      </section>
    </Article>
  );
};
