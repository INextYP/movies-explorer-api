const router = require('express').Router();
const { login, createUser, signOut } = require('../controllers/users');
const {
  registrationValidation, loginValidation,
} = require('../middlewares/validation');

const routerUsers = require('./users');
const routerMovie = require('./movie');

const { authorization } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', registrationValidation, createUser);

router.post('/signin', loginValidation, login);

router.use(authorization);

router.get('/signout', signOut);

router.use('/users', routerUsers);

router.use('/movie', routerMovie);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
