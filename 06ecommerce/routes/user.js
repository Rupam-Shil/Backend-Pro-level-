const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');
const {
	signup,
	login,
	logout,
	forgotPassword,
	passwordReset,
	getLoggedInUserDetails,
	changePassword,
	allAdminUsers,
	updateUserDetails,
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.post('/password/reset/:token', passwordReset);
router.get('/userdashboard', isLoggedIn, getLoggedInUserDetails);
router.post('/password/update', isLoggedIn, changePassword);
router.put('/userdashboard/update', isLoggedIn, updateUserDetails);

router.get('/admin/users', isLoggedIn, customRole('admin'), allAdminUsers);

module.exports = router;
