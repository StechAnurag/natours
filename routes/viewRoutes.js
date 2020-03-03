const router = require('express').Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.bookingSuccess,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.checkAuth, viewController.getAccount);
router.get('/my-tours', authController.checkAuth, viewController.getMyTours);
router.post('/submit-form', authController.checkAuth, viewController.updateUserData);

module.exports = router;
