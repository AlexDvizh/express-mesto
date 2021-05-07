const usersRoutes = require('express').Router();
const {
  getUsers, getUserById, createUser, updateAvatar, updateProfile, login, userInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRoutes.get('/users', auth, getUsers);

usersRoutes.get('/users/:userId', auth, getUserById);

// usersRoutes.post('/users', createUser);

usersRoutes.patch('/users/me', auth, updateProfile);

usersRoutes.patch('/users/me/avatar', auth, updateAvatar);

usersRoutes.get('/users/me', auth, userInfo);

usersRoutes.post('/signin', login);

usersRoutes.post('/signup', createUser);

module.exports = usersRoutes;
