class NotValidData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = NotValidData;
