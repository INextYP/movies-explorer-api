class NotRootError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotRootError';
    this.statusCode = 403;
  }
}

module.exports = NotRootError;
