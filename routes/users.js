const router = require('express').Router();
const { userUpdateValidation } = require('../middlewares/validation');
const { updateUser, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', userUpdateValidation, updateUser);

module.exports = router;
