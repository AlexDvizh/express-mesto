const Cards = require('../models/card');7
const { NotFoundError, NotValidId, NotValidData } = require('../errors/errors');

exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
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
        res.status(400).send(err.message);
      } else {
        res.status(500).send('Произошла ошибка');
      }
      return next(err);
    });
};

exports.deleteCard = (req, res, next) => {
  Cards.remove({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('NotCardId'))
    .then((card) => {
      if(req.user._id === card.owner.toString()) {
        return res.status(200).send(card);
      }
      return Promise.reject(new Error('NotValid'))
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидный айди' });
      } else if (err.message === 'NotValid') {
        res.status(403).send({ message: 'Нельзя удалять карточки других пользователей' });
      } else if (err.message === 'NotCardId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
      return next(err);
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
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидный айди.' });
      } else if (err.message === 'NotCardId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};

exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotCardId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидный айди.' });
      } else if (err.message === 'NotCardId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};
