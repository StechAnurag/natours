const path = require('path');
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
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(`${__dirname}/public`));

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

// 2) ROUTES
app.get('/', (req, res) => res.render('base', { tour: 'The Fores Hiker' }));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// 404 - NOT FOUND ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Reuested resource, ${req.originalUrl} not found!`, 404));
});

// GLOBAL ERROR HANDLING Middlware
app.use(globalErrorHandler);

module.exports = app;
