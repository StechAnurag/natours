const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// heroku speicific
app.enable('trus proxy');

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
// Read URLencoded form Data
app.use(express.urlencoded({ extended: true, limit: '10Kb' }));
// Cookie Parser to read cookie
app.use(cookieParser());

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

// Compress the response
app.use(compression());

// Test Middleware
/* app.use((req, res, next) => {
  console.log(req.cookies);
  next();
}); */

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/', viewRouter);
// 404 - NOT FOUND ROUTE
app.all('*', (req, res, next) => {
  next(new AppError(`Reuested resource, ${req.originalUrl} not found!`, 404));
});

// GLOBAL ERROR HANDLING Middlware
app.use(globalErrorHandler);

module.exports = app;
