import nanoid = require('nanoid');

class Player {
  id: string;
  sockets: Set<string> = new Set();

  constructor(id?: string) {
    this.id = id || nanoid(6);
  }

  public isConnected() {
    return !!this.sockets.size;
  }
}

export default Player;
