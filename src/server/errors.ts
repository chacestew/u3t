export class NotAuthenticatedError extends Error {
  code: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotAuthenticatedError';
    this.code = 401;
  }
}

export class BadRequestError extends Error {
  code: number;
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.code = 400;
  }
}
