import io from 'socket.io-client';
import { useRef } from 'react';

const useSocket = () => {
  const socketRef = useRef<SocketIOClient.Socket>();

  if (!socketRef.current) {
    socketRef.current = io();
  }

  return socketRef.current;
};

export default useSocket;
