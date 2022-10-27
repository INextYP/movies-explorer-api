const dbDev = 'mongodb://127.0.0.1:27017/moviesdb';
const SECRET_KEY = 'dev-secret';

const INCORRECT_DATA_ERROR = 'Переданы неверные данные.';
const MOVIE_NOT_FOUND_DATA_ERROR = 'Фильм с таким данными не найден.';
const USER_NOT_FOUND_DATA_ERROR = 'Пользователь с указанными данными не найден.';
const DEFAULT_VALIDATION_ERROR = 'ValidationError';
const DEFAULT_CAST_ERROR = 'CastError';
const MOVIE_DELETE_ERROR = 'Вы можете удалять только собственные фильмы.';
const USER_REGISTRATION_ERROR = 'Пользователь с такими данными уже зарегистрирован.';
const UNAUTHORIZED_ERROR = 'Необходима авторизация.';
const NOT_FOUND_PAGE_ERROR = 'Страница не найдена';

module.exports = {
  dbDev,
  SECRET_KEY,
  INCORRECT_DATA_ERROR,
  MOVIE_NOT_FOUND_DATA_ERROR,
  DEFAULT_VALIDATION_ERROR,
  DEFAULT_CAST_ERROR,
  MOVIE_DELETE_ERROR,
  USER_REGISTRATION_ERROR,
  USER_NOT_FOUND_DATA_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_PAGE_ERROR,
};
