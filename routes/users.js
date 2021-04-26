const usersRoutes = require('express').Router();
const {getUsers, getUserById, createUser, updateAvatar, updateProfile} = require('../controllers/users');


usersRoutes.get("/users", getUsers);

usersRoutes.get("/users/:userId", getUserById);

usersRoutes.post("/users", createUser);

usersRoutes.patch("/users/me", updateProfile);

usersRoutes.patch("/users/me/avatar", updateAvatar);

module.exports = usersRoutes;