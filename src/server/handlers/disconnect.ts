import { Socket } from 'socket.io';

async function disconnect(socket: Socket) {
  console.log('Goodbye', socket.id);
}

export default disconnect;
