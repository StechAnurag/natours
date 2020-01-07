const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: '../../config.env' });

// Connect to db
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASS);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(con => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Reading command --flag
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleData();
}
