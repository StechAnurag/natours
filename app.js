const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// set Security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // 100 requests per IP
  windowMs: 1 * 60 * 60 * 1000, // Block for 1 hr
  message: 'Too Many Requests from the IP, please try again in an hour'
});
app.use('/api', limiter); // only protect APIs routes

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10Kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSantize());

// Data sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'price',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
app.get('/', (req, res) => res.send('<h1>Welcome to Natours</h1>'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 404 - NOT FOUND ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Reuested resource, ${req.originalUrl} not found!`, 404));
});

// GLOBAL ERROR HANDLING Middlware
app.use(globalErrorHandler);

module.exports = app;
