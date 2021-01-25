import { io, Socket } from 'socket.io-client';
import { useCallback, useRef } from 'react';
import { On, Emit } from '../shared/types';

const socketURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8001'
    : window.location.protocol + '//' + window.location.host;

const useSocket = () => {
  const socketRef = useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = io(socketURL, {
      autoConnect: false,
      path: '/ws',
    });
  }

  const socket = socketRef.current;
  const onEvent: On = useCallback((...args) => socket.on(...args), []);
  const emitEvent: Emit = useCallback((...args) => socket.emit(...args), []);

  return { socket, onEvent, emitEvent };
};

export default useSocket;
