const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const NotRootError = require('../errors/NotRootError');

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
      res.send({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('неверные данные'));
      } else {
        next(error);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner').orFail(new NotFoundError('Фильм с таким данными не найден'))
    .then((movie) => {
      const user = String(req.user._id);
      const movieOwner = String(movie.owner);
      if (user === movieOwner) {
        Movie.findByIdAndRemove(req.params.movieId).select('-owner')
          .then((movieIsDeleted) => res.send(movieIsDeleted))
          .catch(next);
      } else {
        next(new NotRootError('Вы можете удалять только собственные фильмы'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Не верные данные'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
