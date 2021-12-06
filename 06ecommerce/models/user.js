const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
		maxlength: [40, 'Name should be max 40 characters long'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		validate: [validator.isEmail, 'Please enter email in correct format'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minLength: [6, 'password must be at least 6 characters long'],
		select: false,
	},
	role: {
		type: String,
		default: 'user',
	},
	photo: {
		id: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		},
	},
	forgotPasswordToken: String,
	forgotPasswordExpiry: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

//encrypt password before save
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('users', userSchema);

//validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};
//method to create and return jwt token
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRY,
	});
};

//generate forgot password token
userSchema.methods.getForgotPasswordToken = function () {
	//generate a long and random string
	const forgotToken = crypto.randomBytes(20).toString('hex');

	// we are getting a hash - make sure to get a hash on the backend
	this.forgotPasswordToken = crypto
		.createHash('sha256')
		.update(forgotToken)
		.digest('hex');

	//time of token
	this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
	return forgotToken;
};

module.exports = User;
