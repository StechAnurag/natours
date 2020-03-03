const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A booking must belong to a Tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A booking must belong to a User']
    },
    price: {
      type: Number,
      required: [true, 'A booking must have a price']
    },
    paid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
