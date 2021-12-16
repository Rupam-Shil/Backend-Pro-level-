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
	allManagerUsers,
	admingetOneUser,
	adminUpdateUserDetails,
	adminDeleteUsers,
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.post('/password/reset/:token', passwordReset);
router.get('/userdashboard', isLoggedIn, getLoggedInUserDetails);
router.post('/password/update', isLoggedIn, changePassword);
router.put('/userdashboard/update', isLoggedIn, updateUserDetails);

//admin only routes
router.get('/admin/users', isLoggedIn, customRole('admin'), allAdminUsers);
router.get('/admin/user/:id', isLoggedIn, customRole('admin'), admingetOneUser);
router.put(
	'/admin/user/:id',
	isLoggedIn,
	customRole('admin'),
	adminUpdateUserDetails
);
router.delete(
	'/admin/user/:id',
	isLoggedIn,
	customRole('admin'),
	adminDeleteUsers
);

//manager only routes
router.get(
	'/manager/users',
	isLoggedIn,
	customRole('manager'),
	allManagerUsers
);

module.exports = router;
