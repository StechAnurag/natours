const crypto = require('crypto');
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
    minlength: 8,
    select: false
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
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
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

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // for practical reasons
  next();
});

// only query the active (i.e., non deleted) users in each and every query
userSchema.pre(/^find/, function(next) {
  // this, points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Adding a schema Instance method
userSchema.methods.passwordCheck = async function(givenPassword, userPassword) {
  return await bcrypt.compare(givenPassword, userPassword);
};

userSchema.methods.checkPassChanged = function(JWTTimestamp) {
  // check only if the passwordChangedAt field exists
  if (this.passwordChangedAt) {
    const passChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < passChangedTimestamp; // 100iat < 200passChanged, then return true
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPassRestToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires in 10 mins from now

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
