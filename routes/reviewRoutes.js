const router = require('express').Router();
const reviewController = require('./../controllers/reviewController');
const { checkAuth, checkRole } = require('./../controllers/authController');

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(checkAuth, checkRole('user'), reviewController.createReview);

module.exports = router;
