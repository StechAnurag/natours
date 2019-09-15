const express = require('express');
const router = express.Router();
const {
  //checkID,
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

//router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
