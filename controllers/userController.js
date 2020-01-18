const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) newObj[key] = obj[key]; // obj[key] = value
  });
  return newObj;
};

// route param middleware
exports.checkID = (req, res, next, paramVal) => {
  //if invalid id
  // if(idIsIvalide){
  //   return res.status(500).json({
  //     status : "fail",
  //     data : null
  //   })
  // }
  next();
};

exports.createUser = (req, res, next) => {
  // const newId = Users[Users.length - 1].id + 1;
  // const newUser = Object.assign({ id: newId }, req.body);
  //Users.push(newUser);
  res.status(201).json({
    status: 'success',
    data: {
      user: 'newUser'
    }
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Please use /change-password to update password', 400));
  }

  // 2) Filtered out unwanted fields names
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    // also req.user._id is same
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// DO NOT UPDATE PASSWORD with this!
exports.updateUser = factory.updateOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
