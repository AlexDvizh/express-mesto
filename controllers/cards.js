const Cards = require('../models/card');

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

exports.createCard = (req, res) => {
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
    });
};

exports.deleteCard = (req, res) => {
  Cards.delete({})
    .orFail(new Error('NotCardId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotCardId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.likeCard = (req, res) => {
  const owner = req.user._id;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
