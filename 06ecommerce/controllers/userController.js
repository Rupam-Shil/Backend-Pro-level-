const User = require('../models/user');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const mailerHelper = require('../utils/emailHelper');
const crypto = require('crypto');

exports.signup = BigPromise(async (req, res, next) => {
	let result;
	if (req.files) {
		let file = req.files.photo;
		result = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: 'ecom',
			width: 150,
			crop: 'scale',
		});
	}

	const { name, email, password } = req.body;
	if (!email || !name || !password) {
		return next(new CustomError('All fields are mandatory', 400));
	}

	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url,
		},
	});
	cookieToken(res, user);
	// const { userImage } = req.files;
});

exports.login = BigPromise(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email && !password) {
		return next(new CustomError('All fields are required', 400));
	}
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new CustomError('User not registered', 400));
	}
	const isPasswordMatched = await user.isValidatedPassword(password);
	if (!isPasswordMatched) {
		return next(new CustomError('Invalid credentials', 400));
	}
	cookieToken(res, user);
});

exports.logout = BigPromise(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: 'Logout Success',
	});
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return next(new CustomError('User does not exist', 400));
	}

	const forgotToken = user.getForgotPasswordToken();
	// doesn't check and save
	await user.save({ validateBeforeSave: false });

	const myUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/password/reset/${forgotToken}`;
	const message = `Copy paste this link in your url and hit enter \n\n ${myUrl}`;

	try {
		await mailerHelper({
			email: user.email,
			subjectL: 'Ecom store-Password reset email',
			message,
		});
		res.status(200).json({
			success: true,
			message: 'email sent successfully',
		});
	} catch (err) {
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiry = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new CustomError(error.message, 500));
	}
});

exports.passwordReset = BigPromise(async (req, res, next) => {
	const { token } = req.params;

	const encryToken = crypto.createHash('sha256').update(token).digest('hex');

	const user = await User.findOne({
		encryToken,
		forgotPasswordExpiry: { $gt: Date.now() },
	});

	if (!user) {
		return next(new CustomError('Token in invalid', 400));
	}

	if (req.body.password !== req.body.confirmpassword) {
		return next(
			new CustomError('password and confirm password do not match', 400)
		);
	}
	user.password = req.body.password;
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiry = undefined;
	await user.save();

	//send a json response
	cookieToken(res, user);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.send({
		success: true,
		user,
	});
});

exports.changePassword = BigPromise(async (req, res, next) => {
	const userId = req.user.id;
	const user = await User.findById(userId).select('+password');

	const { oldPassword, newPassword } = req.body;

	const isCorrectOldPassword = user.isValidatedPassword(oldPassword);
	if (!isCorrectOldPassword) {
		return next(new CustomError('Password didnt match', 400));
	}
	user.password = newPassword;
	await user.save();

	cookieToken(res, user);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
	const { name, email } = req.body;
	if (!name && !email) {
		return next(new CustomError('all fields required', 400));
	}
	const newData = {
		name,
		email,
	};
	if (req.files) {
		const user = await User.findById(req.user.id);
		const imageId = user.photo.id;
		const resp = await cloudinary.uploader.destroy(imageId);
		const result = await cloudinary.uploader.upload(
			req.files.photo.tempFilePath,
			{
				folder: 'ecom',
				width: 150,
				crop: 'scale',
			}
		);
		newData.photo = {
			id: result.public_id,
			secure_url: result.secure_url,
		};
	}
	const user = await User.findByIdAndUpdate(req.user.id, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
	});
});

exports.allAdminUsers = BigPromise(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

exports.admingetOneUser = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		next(new CustomError('No user found', 401));
	}
	res.status(200).json({
		success: true,
		user,
	});
});

exports.adminUpdateUserDetails = BigPromise(async (req, res, next) => {
	const { name, email, role } = req.body;
	if (!name && !email) {
		return next(new CustomError('all fields required', 400));
	}
	const newData = {
		name,
		email,
		role,
	};

	const user = await User.findByIdAndUpdate(req.params.id, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

exports.adminDeleteUsers = BigPromise(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new CustomError('No user found', 401));
	}
	const imageId = user.photo.id;

	await cloudinary.uploader.destroy(imageId);

	await user.remove();
	res.status(200).json({
		success: true,
	});
});

exports.allManagerUsers = BigPromise(async (req, res, next) => {
	const users = await User.find({ role: 'user' });

	res.status(200).json({
		success: true,
		users,
	});
});
