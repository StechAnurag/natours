const router = require('express').Router();
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

router.use(authController.checkAuth);

router.get('/me', viewController.getAccount);
//router.get('/my-tours', bookingController.bookingSuccess, viewController.getMyTours);
router.get('/my-tours', viewController.getMyTours);
router.post('/submit-form', viewController.updateUserData);

module.exports = router;
