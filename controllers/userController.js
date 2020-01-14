const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

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

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    numOfUsers: users.length,
    data: {
      users
    }
  });
});

exports.getUser = (req, res) => {
  const id = req.params.id * 1;
  res.status(200).json({
    status: 'success',
    data: {
      data: id
    }
  });
};
exports.createUser = (req, res) => {
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

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: '<Updated User here...>'
    }
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.deleteUser = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: null
  });
};
