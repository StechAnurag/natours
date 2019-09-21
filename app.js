const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.get('/', (req, res) => res.send('<h1>Welcome to Natours</h1>'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 404 - NOT FOUND ROUTE
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Reuested resource, ${req.originalUrl} not found!`
  // });

  // const err = new Error(`Reuested resource, ${req.originalUrl} not found!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  next(new AppError(`Reuested resource, ${req.originalUrl} not found!`, 404));
});

// GLOBAL ERROR HANDLING Middlware
app.use(globalErrorHandler);

module.exports = app;
