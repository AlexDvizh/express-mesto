const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6086893942026202f8eadd7f',
  };

  next();
});

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.get('*', (req, res) => {
  res.status(404).send('Ошибка 404');
});

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('Connected to db');

  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
