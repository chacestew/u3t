import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('/coordinator');

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
    <article
      css="
        width: 50%;
        display: flex;
        flex-direction: column;
      "
    >
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
    </article>
  );
};
