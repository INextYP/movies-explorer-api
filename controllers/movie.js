const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');

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
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
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
  Movie.findById(req.params.movieId).select('+owner')
    .then(() => {
      Movie.findByIdAndRemove(req.params.movieId).select('-owner')
        .then((movieIsDeleted) => res.send(movieIsDeleted))
        .catch(next);
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
