class Connection {
  socket: string;
  lobby: string | null = null;
  player: string | null = null;

  constructor(socket: string) {
    this.socket = socket;
  }
}

class ConnectionManager {
  connections: Map<string, Connection> = new Map();

  public add(id: string) {
    this.connections.set(id, new Connection(id));
  }

  public remove(id: string) {
    return this.connections.delete(id);
  }
}

export default ConnectionManager;
