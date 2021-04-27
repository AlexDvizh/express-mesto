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
    required: true
  },
  owner: {
    type: Array,
    required: true
  },
  likes: {
    type: Array,
    required: true,
    default: []
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('card', cardSchema);