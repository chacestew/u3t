import Game from './ServerGame';

const isEven = num => num !== 0 && !(num % 2);

const games = new Map();
const queue = new Set();

let rooms = 0;

export default server => {
  const io = require('socket.io')(server);

  io.on('connection', socket => {
    let room;
    let game;

    console.log('connected!', socket.id);

    socket.on('join-queue', () => {
      if (isEven(queue.size + 1)) {
        const otherSocket = [...queue].pop();
        queue.delete(otherSocket);

        rooms += 1;
        room = rooms;
        game = new Game([socket.id, otherSocket.id]);
        games.set(room, game);
        console.log('got two! game:', room, 'players:', [socket.id, otherSocket.id]);

        io.to(socket.id)
          .to(otherSocket.id)
          .emit('found-match', { room });
      } else {
        queue.add(socket);
      }
    });

    socket.on('join', data => {
      game = games.get(data.room);
      if (!game) throw new Error(`No game found by that ID: ${data.room}`);
      const seat = game.joinPlayer(socket.id);

      socket.join(data.room, err => {
        if (err) throw new Error(err);

        socket.emit('joined', { seat }, () => {
          if (game.isReadyToStart()) {
            io.to(data.room).emit('started', { state: game.getGameState() });
          }
        });
      });
    });

    socket.on('play', data => {
      const nextState = game.playTurn({
        id: socket.id,
        player: data.player,
        board: data.board,
        cell: data.cell,
      });

      if (nextState.error) {
        // errorhandling
      }

      socket.broadcast.to(data.room).emit('sync', { state: nextState });
    });

    socket.on('disconnect', () => {
      console.log('disconnected!', socket.id);
    });
  });
};
