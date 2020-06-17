import io from 'socket.io-client';
import { useRef } from 'react';
import { On, Emit } from '../../shared/types';

const useSocket = () => {
  const socketRef = useRef<SocketIOClient.Socket>();

  if (!socketRef.current) {
    socketRef.current = io();
  }

  const socket = socketRef.current;
  const onEvent: On = (...args) => socket.on(...args);
  const emitEvent: Emit = (...args) => socket.emit(...args);

  return { socket, onEvent, emitEvent };
};

export default useSocket;
