import { lobbies } from '.';

class Connection {
  socket: string;
  lobby: string | null = null;
  player: string | null = null;

  constructor(socket: string) {
    this.socket = socket;
  }

  public setLobby(lobby: string) {
    this.lobby = lobby;
  }

  public setPlayer(player: string) {
    this.player = player;
  }
}

class ConnectionManager {
  connections: Map<string, Connection> = new Map();

  public add(id: string) {
    console.log('Adding connection:', id);
    this.connections.set(id, new Connection(id));
  }

  public remove(id: string) {
    console.log('Removing connection:', id);
    const { lobby, player } = this.get(id);

    if (lobby && player) {
      lobbies
        .get(lobby)
        .getPlayer(player)
        .sockets.delete(id);
    }

    return this.connections.delete(id);
  }

  public get(id: string) {
    const connection = this.connections.get(id);
    if (!connection) throw new Error(`No connection for ID: ${id}`);
    return connection;
  }
}

export default ConnectionManager;
