const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// Unique Index for preventing duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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
    select: 'name photo'
  });
  next();
});

// Schema Static Method : can be called directly on the Model
reviewSchema.statics.calcAvgRatings = async function(tourID) {
  // this - keyword belongs to the current model, so we can call aggregate on it
  const stats = await this.aggregate([
    { $match: { tour: tourID } },
    { $group: { _id: '$tour', nRating: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
  ]);

  await Tour.findByIdAndUpdate(tourID, {
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0
  });
};

// Calling the static method each time a new review is saved
reviewSchema.post('save', function() {
  // this - keyword points to current review document
  // Review.calcAvgRatings(this.tour); -- the problem is Review variable is not yet defined in the code
  this.constructor.calcAvgRatings(this.tour);
});

//Accessing the currently queried document inside : QUERY MIDDLEWARE
reviewSchema.pre(/^findOneAnd/, async function(next) {
  //const r = await this.findOne();
  // Passing review to next middleware
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, since query has already executed

  // this.r --> is a review Document
  await this.r.constructor.calcAvgRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
