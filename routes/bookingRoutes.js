const router = require('express').Router();
const bookingController = require('./../controllers/bookingController');
const { checkAuth, checkRole } = require('./../controllers/authController');

router.use(checkAuth);
router.get('/checkout-session/:tourID', bookingController.getCheckoutSession);

// router.use(checkRole('admin', 'lead-guide'));

router
  .route('/')
  .post(bookingController.createBooking)
  .get(bookingController.getBookings);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
