require('dotenv').config();

const { PORT = 3005, NODE_ENV, DB_SECRET } = process.env;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rateLimiter');
const { dbDev } = require('./utils/constants');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const allowedCors = [
  'https://react.movies.nomoredomains.club',
  'http://react.movies.nomoredomains.club',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

mongoose.connect(NODE_ENV === 'production' ? DB_SECRET : dbDev, {
  useNewUrlParser: true,
});

app.use(cors(corsOptions));

app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
