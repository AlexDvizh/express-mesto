const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, getUserById, createUser, updateAvatar, updateProfile, login, userInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRoutes.get('/users', auth, getUsers);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), auth, updateProfile);

usersRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Url аватара невалидный');
    }),
  }),
}), auth, updateAvatar);

usersRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex()
  }),
}), auth, getUserById);

usersRoutes.get('/users/me', auth, userInfo);

usersRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

usersRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Url аватара невалидный');
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports = usersRoutes;
