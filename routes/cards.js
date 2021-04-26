const cardsRoutes = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard} = require('../controllers/cards');

cardsRoutes.get("/cards", getCards);

cardsRoutes.post("/cards", createCard);

cardsRoutes.delete("/cards/:cardId", deleteCard);

cardsRoutes.put("/cards/:cardId/likes", likeCard);

cardsRoutes.delete("/cards/:cardId/likes", dislikeCard);

module.exports = cardsRoutes;