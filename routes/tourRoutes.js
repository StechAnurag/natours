const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { checkAuth, checkRole } = require('../controllers/authController');
//const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

// Redirect all the requests like this to reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(checkAuth, tourController.getAllTours)
  .post(checkAuth, tourController.createTour);

router
  .route('/:id')
  .get(checkAuth, tourController.getTour)
  .patch(checkAuth, tourController.updateTour)
  .delete(checkAuth, checkRole('admin', 'lead-guide'), tourController.deleteTour);
// only these two roles have permission to delete a tour

// POST /tour/5e1695abc9of/reviews
// GET /tour/5e1695abc9of/reviews
// GET /tour/5e1695abc9of/reviews/6fe8080abc9omg

/* BAD Practice
router
  .route('/:tourId/reviews')
  .post(checkAuth, checkRole('user'), reviewController.createReview)
  .get(reviewController.getAllReviews); */

module.exports = router;
