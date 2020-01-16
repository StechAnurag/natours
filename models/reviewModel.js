const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Populate User , Tour through : query middleware
reviewSchema.pre(/^find/, function(next) {
  /* this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name'
  }); */
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
