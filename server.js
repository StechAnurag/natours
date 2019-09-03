const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
//console.log(process.env);

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

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`App is ready on : http://127.0.0.1:${port}`)
);
