const router = require('express').Router();
const { login, createUser, signOut } = require('../controllers/users');
const {
  registrationValidation, loginValidation,
} = require('../middlewares/validation');

const routerUsers = require('./users');
const routerMovie = require('./movie');

const { authorization } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_PAGE_ERROR } = require('../utils/constants');

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

router.use('/movies', routerMovie);

router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR));
});

module.exports = router;
