enum Errors {
  NotFoundError = 'NotFoundError',
  BadRequestError = 'BadRequestError',
  SocketError = 'SocketError',
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.NotFoundError;
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.BadRequestError;
  }
}

export class SocketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = Errors.SocketError;
  }
}
