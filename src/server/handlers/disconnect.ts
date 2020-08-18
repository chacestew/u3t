import socketIO = require('socket.io');

async function disconnect(socket: socketIO.Socket) {
  console.log('Goodbye', socket.id);
}

export default disconnect;
