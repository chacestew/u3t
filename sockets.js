import Game from './ServerGame';

const games = new Map();
let rooms = 0;

export default server => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    let room;
    let game;

    socket.on('join', data => {
      if (!data.room) {
        rooms += 1;
        room = rooms;
        game = new Game();
        games.set(room, games);
        socket.join(`room:${rooms}`);
        socket.emit('joined', { room: rooms });
      } else {
        game = games.get(data.room);
        if (!game) throw new Error('No game found by that ID.');
        room = { data: { room } };
        game.joinPlayer(socket.id);
        socket.join(`room:${room}`);
        socket.to(room).emit('joined');
      }

      if (game.getReadyStatus()) {
        game.assignSeats();
        game.getPlayers().forEach(p => {
          socket.to(p).emit('seat', game.getSeatById(p));
        });
      }
    });

    socket.on('play', data => {
      game.playTurn(data.state);
      const nextState = game.getGameState();
      if (nextState.error) {
        // errorhandling
      }
      socket.to(data.room).emit('sync', { state: nextState });
    });

    socket.on('disconnect', () => {
      // handle leaver
    });
  });
};
