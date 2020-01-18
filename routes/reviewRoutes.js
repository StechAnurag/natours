const router = require('express').Router({ mergeParams: true });
const reviewController = require('./../controllers/reviewController');
const { checkAuth, checkRole } = require('./../controllers/authController');

/*
 * Protect the below Routes
 */

router.use(checkAuth);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(checkRole('user'), reviewController.setTourUserIDs, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(checkRole('user', 'admin'), reviewController.updateReview)
  .delete(checkRole('user', 'admin'), reviewController.deleteReview);

module.exports = router;
