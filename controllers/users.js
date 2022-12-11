const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const {
  SECRET_KEY,
  INCORRECT_DATA_ERROR,
  DEFAULT_VALIDATION_ERROR,
  DEFAULT_CAST_ERROR,
  USER_REGISTRATION_ERROR,
  USER_NOT_FOUND_DATA_ERROR,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
    secure: false,
  }).send({ message: 'Выход' });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id, name: user.name, email,
      });
    })
    .catch((err) => {
      if (err.name === DEFAULT_VALIDATION_ERROR) {
        next(new BadRequestError(INCORRECT_DATA_ERROR));
      } else if (err.code === 11000) {
        next(new ConflictError(USER_REGISTRATION_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
      });
      res.send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      return next(new NotFoundError(USER_NOT_FOUND_DATA_ERROR));
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === DEFAULT_CAST_ERROR) {
      return next(new BadRequestError(INCORRECT_DATA_ERROR));
    }
    return next(error);
  });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new BadRequestError(INCORRECT_DATA_ERROR);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === DEFAULT_VALIDATION_ERROR) {
        next(new BadRequestError(INCORRECT_DATA_ERROR));
      } else if (err.code === 11000) {
        next(new ConflictError(USER_REGISTRATION_ERROR));
      } else {
        next(err);
      }
    });
};
