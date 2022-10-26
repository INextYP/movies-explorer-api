require('dotenv').config();

const { PORT = 3000 } = process.env;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, DB_SECRET } = process.env;

const app = express();

// const allowedCors = [
//   'https://mesto.react.nomoredomains.icu',
//   'http://mesto.react.nomoredomains.icu',
//   'http://localhost:3000',
//   'https://localhost:3000',
// ];

// const corsOptions = {
//   origin: allowedCors,
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

mongoose.connect(NODE_ENV === 'production' ? DB_SECRET : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

// app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Ошибка' });
  }

  next();
});

app.listen(PORT);
