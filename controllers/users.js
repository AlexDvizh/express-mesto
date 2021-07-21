const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const Users = require('../models/user');
const NotValidData = require('../errors/NotValidData');
const NotFoundError = require('../errors/NotFoundError');
const NotValidEmail = require('../errors/NotValidEmail');
const NotValidLoginOrPass = require('../errors/NotValidLoginOrPass');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => {
      next(new NotFoundError('Запрашиваемый пользователь не найден'));
    });
};

exports.getUserById = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы некорректные данные при обновлении профиля'));
      }
    });
};

exports.createUser = (req, res, next) => {
  const { email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then(() => Users.findOne({ email }).select('-password'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new NotValidEmail('Пользователь с переданным email уже существует'));
      }
    });
};

exports.updateProfile = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  Users.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при обновлении профиля'));
      }
    });
};

exports.updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new NotValidData('Переданы некорректные данные при обновлении аватара'));
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      console.log(token);
      return res.send({ token });
    })
    .catch(() => {
      next(new NotValidLoginOrPass('Передан неверный логин или пароль'));
    });
};

exports.userInfo = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  return Users.findUserByCredentials(req.user._id, {
    name,
    about,
    avatar,
    email,
  })
    .orFail(new Error('NotUserId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Передан невалидный id'));
      }
    });
};
