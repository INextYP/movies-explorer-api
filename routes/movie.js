const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');
const { createMovieValidation, movieSearchValidation } = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', createMovieValidation, createMovie);

router.delete('/:movieId', movieSearchValidation, deleteMovie);

module.exports = router;
