import { io, Socket } from 'socket.io-client';
import { useRef } from 'react';
import { On, Emit } from '../shared/types';

const useSocket = () => {
  const socketRef = useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = io(window.location.protocol + '//' + window.location.host, {
      path: '/ws',
    });
  }

  const socket = socketRef.current;
  const onEvent: On = (...args) => socket.on(...args);
  const emitEvent: Emit = (...args) => socket.emit(...args);

  return { socket, onEvent, emitEvent };
};

export default useSocket;
