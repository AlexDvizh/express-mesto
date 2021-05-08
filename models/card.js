const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длинна - 2 символа'],
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    match: [/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!])*)?/, 'Введите правильную ссылку'],
  },
  owner: {
    type: Array,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
