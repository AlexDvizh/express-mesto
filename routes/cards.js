const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/cards', auth, getCards);

cardsRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Url карточки невалидный');
    }),
  }),
}), auth, createCard);

cardsRoutes.delete('/cards/:cardId', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex()
  },
}), auth, deleteCard);

cardsRoutes.put('/cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex()
  },
}), auth, likeCard);

cardsRoutes.delete('/cards/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex()
  },
}), auth, dislikeCard);

module.exports = cardsRoutes;
