import Game from './game';

const doStuffWithIo = io => {
  // socket
  let rooms = 0;
  const games = new Map();

  io.on('connection', socket => {
    let game = null;
    console.log('connected!', socket.id);

    // Start Game
    socket.on('createGame', data => {
      game = new Game(socket.id);
      rooms += 1;
      games.set(rooms, game);
      socket.join(`room-${rooms}`);
      socket.emit('gameCreated', { room: `room-${rooms}`, state: game.getGameState() });
      // Emit game ID back to creator
    });

    // Join Game
    socket.on('joinGame', data => {
      game = games.get(data.id);
      if (!game) return; // return a 'game not found' error
      game.join(socket.id);
      const state = game.getGameState();
      socket.join(data.id);
      io.to(data.id).emit('started', { state });
    });

    // Play Turn
    socket.on('playTurn', data => {
      game.playTurn(socket.id, data);
    });
  });
};

export default doStuffWithIo;
