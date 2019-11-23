const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser._id,
      token
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist in request body
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.passwordCheck(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything is ok, send the token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  });
});

exports.checkAuth = catchAsync(async (req, res, next) => {
  // 1) Get the token and check it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("You're not logged in, Please login to get access.", 401)
    );
  }
  // 2) verify token

  // 3) check if user still exists

  // 4) check if user has changed password after issue of token
  next();
});
