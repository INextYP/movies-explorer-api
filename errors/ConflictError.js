class ConflictError extends Error {
  constructor(message = 'Данный email уже существует.') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
