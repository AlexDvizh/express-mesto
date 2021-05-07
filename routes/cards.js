const cardsRoutes = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/cards', auth, getCards);

cardsRoutes.post('/cards', auth, createCard);

cardsRoutes.delete('/cards/:cardId', auth, deleteCard);

cardsRoutes.put('/cards/:cardId/likes', auth, likeCard);

cardsRoutes.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = cardsRoutes;
