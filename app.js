require('dotenv').config();

const { PORT = 3000, NODE_ENV, DB_SECRET } = process.env;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rateLimiter');
const { dbDev } = require('./utils/constants');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_SECRET : dbDev, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
