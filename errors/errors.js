class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class NotValidId extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotValidData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = NotFoundError, NotValidId, NotValidData;

