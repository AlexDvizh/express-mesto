const Cards = require('../models/card');

exports.getCards = (req, res) => {
  Cards.find({})
    .then((card) => {
      res.send({data: card})
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}

exports.createCard = (req, res) => {
  console.log(req.user._id);
  const owner = req.user._id;
  const {name, link} = req.body;

  Cards.create({name, link, owner})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}


exports.deleteCard = (req, res) => {
  Cards.delete({})
    .then((card) => {
      res.status(200).send(card);
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
  .then((card) => res.status(200).send(card))
  .catch(() => {
    res.status(500).send({ message: 'Произошла ошибка' })
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
    res.status(500).send({ message: 'Произошла ошибка' })
  })
}
