import React, { useEffect } from 'react';
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
  }, []);

  const makeLobby = () => {
    socket.emit('create-lobby');
  };

  const findGame = () => {
    socket.emit('join-queue');
  };

  return (
    <div>
      <button type="button" onClick={makeLobby}>
        Make lobby
      </button>
      <button type="button" onClick={findGame}>
        Find game
      </button>
    </div>
  );
};
