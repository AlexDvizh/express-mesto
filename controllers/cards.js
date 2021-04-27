const Cards = require('../models/card');

exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      if(card) {
        res.status(200).send({data: card})
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}

exports.createCard = (req, res) => {
  const owner = req.user._id;
  const {name, link} = req.body;

  Cards.create({name, link, owner})
    .then((card) => {
      Cards.find({}).populate(["owner", "likes"]);
      res.status(200).send(card);
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.status(400).send(err.message);
      } else {
        res.status(500).send('Произошла ошибка');
      }
    })
}


exports.deleteCard = (req, res) => {
  Cards.delete({})
    .then((card) => {
      if(user) {
        res.status(200).send(card)
      } else {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}


exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  .then((card) => res.status(200).send({data: card}))
  .catch((err) => {
    if(err.name === 'CastError') {
      debugger;
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  })
}


exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => res.status(200).send(card))
  .catch(() => {
    if(err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  })
}
