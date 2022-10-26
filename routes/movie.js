const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movie');
const { createMovieValidation, movieSearchValidation } = require('../middlewares/validation');

router.get('/movies', getMovies);

router.post('/movies', createMovieValidation, createMovie);

router.delete('/movies/:id', movieSearchValidation, deleteMovie);

module.exports = router;
