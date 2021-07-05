const jwt = require('jsonwebtoken');
const NotValidLoginOrPass = require('../errors/NotValidLoginOrPass');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotValidLoginOrPass('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new NotValidLoginOrPass('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
