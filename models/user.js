const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v), message: 'Неправильный формат e-mail',
    },
  },
  password: {
    type: String, required: true, select: false,
  },
  name: {
    type: String, minlength: 2, maxlength: 30, default: 'Александр',
  },
});

userSchema.statics.findUserByCredentials = function findOneByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
