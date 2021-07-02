const { Error } = require('mongoose');
const Cards = require('../models/card');
const NotValidData = require('../errors/NotValidData');
const NotFoundError = require('../errors/NotFoundError');
const NotValidCard = require('../errors/NotValidCard');

exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner })
    .then((card) => {
      Cards.find({}).populate(['owner', 'likes']);
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidData('Некорректные данные имени или ссылки'));
      }
    });
};

exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Некорректный id карточки'))
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        return card.remove()
          .then(() => res.send('Карточка удалена'));
      }
      throw new NotValidCard('Попытка удалить чужую карточку');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы неккоретные данные'));
      } else {
        next(err);
      }
    });
};

exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotCardId'))
    .then((card) => {
      res.status(200).send({ data: card, message: 'Лайк добавлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы неккоректные данные'));
      } else if (err.message === 'NotCardId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
    });
};

exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotCardId'))
    .then((card) => res.status(200).send({ card, message: 'Лайк удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidData('Переданы неккоректные данные'));
      } else if (err.message === 'NotCardId') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
    });
};
