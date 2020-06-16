import io from 'socket.io-client';
import { useRef } from 'react';
import { Events, EventParams } from '../../shared/types';

type On = <E>(
  event: E & Events,
  fn: (params: EventParams[typeof event]) => any
) => unknown;

type Emit = <E>(event: E & Events, eventParams?: EventParams[typeof event]) => unknown;

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
