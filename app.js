require('dotenv').config();

const { PORT = 3001 } = process.env;
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, DB_SECRET } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_SECRET : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
