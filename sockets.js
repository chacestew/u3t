import nanoid from 'nanoid';
import socketIO from 'socket.io';
import Game from './ServerGame';

const isEven = num => num !== 0 && !(num % 2);

const games = new Map();
const queue = new Set();

const createNewGame = turnDuration => {
  const id = nanoid(5);
  const game = new Game(turnDuration);
  games.set(id, game);
  return [game, id];
};

export default server => {
  const io = socketIO(server);
  const coordinatorSocket = io.of('/coordinator');
  const gameSocket = io.of('/game');

  coordinatorSocket.on('connection', socket => {
    console.log('joined coordinatorSocket', socket.id);
    socket.on('create-lobby', () => {
      const [, id] = createNewGame();
      socket.join(id);
      socket.emit('lobby-ready', { id });
    });

    socket.on('join-queue', () => {
      if (isEven(queue.size + 1)) {
        const otherSocket = [...queue].pop();
        queue.delete(otherSocket);

        const [game, id] = createNewGame(60);
        coordinatorSocket
          .to(socket.id)
          .to(otherSocket.id)
          .emit('lobby-ready', { id });
      } else {
        queue.add(socket);
      }
    });
  });

  gameSocket.on('connection', socket => {
    console.log('joined gameSocket', socket.id);
    socket.on('join-lobby', data => {
      const game = games.get(data.room);
      if (!game) throw new Error(`No game found by that ID: ${data.room}`);

      game.joinPlayer(socket.id);

      socket.join(data.room, err => {
        if (err) throw new Error(err);

        if (game.isReadyToStart()) {
          const seats = game.assignSeats();
          const state = game.getGameState();
          seats.forEach((player, seat) => {
            gameSocket.to(player).emit('game-started', {
              seat: seat + 1,
              state,
              time: new Date().getTime(),
            });
          });
        }
      });
    });

    socket.on('play-turn', data => {
      const game = games.get(data.room);

      const emitter = state =>
        gameSocket.to(data.room).emit('sync', { state, time: new Date().getTime() });

      const nextState = game.playTurn(
        {
          id: socket.id,
          player: data.player,
          board: data.board,
          cell: data.cell,
        },
        emitter
      );

      if (nextState.error) {
        // errorhandling
      }

      emitter(nextState);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from GAME!', socket.id);
    });
  });
};
