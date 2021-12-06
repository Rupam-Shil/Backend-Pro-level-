const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

module.exports = User;
