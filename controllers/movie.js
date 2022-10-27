const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const NotRootError = require('../errors/NotRootError');
const {
  INCORRECT_DATA_ERROR,
  MOVIE_NOT_FOUND_DATA_ERROR,
  DEFAULT_VALIDATION_ERROR,
  MOVIE_DELETE_ERROR,
  DEFAULT_CAST_ERROR,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((error) => {
      if (error.name === DEFAULT_VALIDATION_ERROR) {
        next(new BadRequestError(INCORRECT_DATA_ERROR));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner').orFail(new NotFoundError(MOVIE_NOT_FOUND_DATA_ERROR))
    .then((movie) => {
      const user = String(req.user._id);
      const movieOwner = String(movie.owner);
      if (user === movieOwner) {
        Movie.findByIdAndRemove(req.params.movieId).select('-owner')
          .then((movieIsDeleted) => res.send(movieIsDeleted))
          .catch(next);
      } else {
        next(new NotRootError(MOVIE_DELETE_ERROR));
      }
    })
    .catch((error) => {
      if (error.name === DEFAULT_CAST_ERROR) {
        next(new BadRequestError(INCORRECT_DATA_ERROR));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
