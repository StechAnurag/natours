const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pleae tell us your name!']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please provide us your email'],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm a password'],
    validate: {
      // This validator only works on CREATE and SAVE !!! not on UPDATE
      validator: function(el) {
        return this.password === el;
      },
      message: 'Passwords do not Match'
    }
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if the password is actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the confirm password field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
