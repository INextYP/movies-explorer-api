const router = require('express').Router();
const { login, createUser, signOut } = require('../controllers/users');
const {
  registrationValidation, loginValidation,
} = require('../middlewares/validation');

const routerUsers = require('./users');
const routerMovie = require('./movie');

const { authorization } = require('../middlewares/auth');

router.post('/signup', registrationValidation, createUser);

router.post('/signin', loginValidation, login);

router.use(authorization);

router.get('/signout', signOut);

router.use('/users', routerUsers);

router.use('/movie', routerMovie);

module.exports = router;
