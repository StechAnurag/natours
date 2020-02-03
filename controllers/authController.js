const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const User = require('./../models/userModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    //maxAge : Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //secure: true,
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user
    }
  });
};

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  createAndSendToken(newUser, 201, res);
  /* const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser._id,
      token
    }
  }); */
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
  createAndSendToken(user, 200, res);
  /* const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  }); */
});

exports.checkAuth = catchAsync(async (req, res, next) => {
  // 1) Get the token and check it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You're not logged in, Please login to get access.", 401));
  }
  // 2) verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User belonging to this token, does no longer exist', 401));
  }

  // 4) check if user has changed password after issue of token
  if (user.checkPassChanged(decoded.iat)) {
    return next(new AppError('User recently changed password, please login again.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.checkRole = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']  - has access to roles array due to closure
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate random reset token
  const resetToken = user.createPassRestToken();
  user.save({ validateBeforeSave: false }); // disable validation before updating a document

  // 3) send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request wit your new password and password confirm to : ${resetURL}.\n If you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10mins)',
      message
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to your email, please check your email!'
    });
  } catch (err) {
    // In case of any error with sending Email, Rollback to previous state
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);
    return next(new AppError('There was an error sending email, please try agian later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) If there is a user and the token has not expired, set the new Password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update the changePasswordAt property for the user

  // 4) Log the user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const user = await User.findById(req.user._id).select('+password');

  // 2) check if POSTed current password is correct
  if (!(await user.passwordCheck(req.body.currentPassword, user.password))) {
    return next(new AppError('Incorrect current password', 401));
  }

  // 3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log the user in, send JWT
  createAndSendToken(user, 200, res);
});
