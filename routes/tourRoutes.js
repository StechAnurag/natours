const express = require('express');
const router = express.Router();
const {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');
const { checkAuth, checkRole } = require('../controllers/authController');
//const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

// Redirect all the requests like this to reviewRouter
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(checkAuth, getAllTours)
  .post(checkAuth, createTour);

router
  .route('/:id')
  .get(checkAuth, getTour)
  .patch(checkAuth, updateTour)
  .delete(checkAuth, checkRole('admin', 'lead-guide'), deleteTour); // only these two roles have permission to delete a tour

// POST /tour/5e1695abc9of/reviews
// GET /tour/5e1695abc9of/reviews
// GET /tour/5e1695abc9of/reviews/6fe8080abc9omg

/* BAD Practice
router
  .route('/:tourId/reviews')
  .post(checkAuth, checkRole('user'), reviewController.createReview)
  .get(reviewController.getAllReviews); */

module.exports = router;
