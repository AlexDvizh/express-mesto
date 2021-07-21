require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');
const NotFoundError = require('./errors/NotFoundError');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(requestLogger);
app.use(helmet());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.get('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandling);

app.listen(PORT);
