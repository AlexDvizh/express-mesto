const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Запрашиваемый пользователь не найден' }));
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(new Error('NotUserId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидный айди.' });
      } else if (err.message === 'NotUserId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err.message);
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с переданным email уже существует' });
      } else {
        res.status(500).send('Произошла ошибка');
      }
      next(err);
    });
};

exports.updateProfile = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  Users.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

exports.userInfo = (req, res) => {
  const owner = req.user._id;
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  return Users.findUserByCredentials(owner, {
    name,
    about,
    avatar,
    email,
  })
    .orFail(new Error('NotUserId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидный айди.' });
      } else if (err.message === 'NotUserId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
