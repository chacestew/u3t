import socketIO = require('socket.io');
import { connections } from '../entities';

async function disconnect(socket: socketIO.Socket) {
  console.log('Goodbye', socket.id);
  connections.remove(socket.id);
}

export default disconnect;
