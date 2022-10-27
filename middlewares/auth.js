const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { SECRET_KEY, UNAUTHORIZED_ERROR } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);
  } catch (err) {
    throw new AuthError(UNAUTHORIZED_ERROR);
  }
  req.user = payload;
  return next();
};

module.exports = {
  authorization,
};
