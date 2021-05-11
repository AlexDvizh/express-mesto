const usersRoutes = require('express').Router();
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, createUser, updateAvatar, updateProfile, login, userInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRoutes.get('/users', auth, getUsers);

usersRoutes.get('/users/:userId', auth, getUserById);

// usersRoutes.post('/users', createUser);

usersRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRoutes.patch('/users/me/avatar', auth, updateAvatar);

usersRoutes.get('/users/me', auth, userInfo);

usersRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

usersRoutes.post('/signup', createUser);

module.exports = usersRoutes;
