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

module.exports = router;
