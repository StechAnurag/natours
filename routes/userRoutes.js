const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} = require('../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

/*
 * Protect the below routes : with single use of checkAuth
 */

router.use(authController.checkAuth);

router.patch('/change-password', authController.changePassword);
router.get('/me', getMe, getUser);
router.patch('/updateme', updateMe);
router.delete('/delete-account', deleteMe);

/*
 * Restrict the below routes : to Admin
 */

router.use(authController.checkRole('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
