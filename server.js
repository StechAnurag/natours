const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log(`${err.name} : ${err.message}`);
  console.log('UNHANDLED EXCEPTION : Shutting down ..');
  process.exit(1);
});

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
  .then(con => console.log('MongoDB connected'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`App is ready on : http://127.0.0.1:${port}`)
);

process.on('unhandledRejection', err => {
  console.log(`${err.name} : ${err.message}`);
  console.log('UNHANDLED REJECTION : Shutting down ..');
  server.close(() => {
    process.exit(1);
  });
});
