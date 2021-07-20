const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');
const NotFoundError = require('./errors/NotFoundError');

const {
  PORT = 3005,
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

 // const allowedCors = [
 //   'https://mesto.alexdvizh.nomoredomains.rocks',
 //   'http://mesto.alexdvizh.nomoredomains.rocks',
 //   'localhost:3000',
 //   'localhost:3005'
 // ];
 //
 // app.use(function(req, res, next) {
 //   const { origin } = req.headers;
 //   if (allowedCors.includes(origin)) {
 //     res.header("Access-Control-Allow-Origin", origin);
 //   }
 //
 //   const { method } = req;
 //
 //   const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';
 //
 //   const requestHeaders = req.headers['access-control-request-headers'];
 //     if (method === 'OPTIONS') {
 //       res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
 //       // разрешаем кросс-доменные запросы с этими заголовками
 //       res.header('Access-Control-Allow-Headers', requestHeaders);
 //       res.status(200).send();
 //     }
 //
 //     next();
 // });

app.use(helmet());

app.use(express.json());

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.get('*', (req, res, next) => {
  next(new NotFoundError('Ошибка 404. Страница не найдена'));
});

app.use(errors());

app.use(centralizedErrorHandling);

app.listen(PORT);
