const User = require('../models/user');
const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

exports.signup = BigPromise(async (req, res, next) => {
	let result;
	if (req.files) {
		console.log('here');
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
