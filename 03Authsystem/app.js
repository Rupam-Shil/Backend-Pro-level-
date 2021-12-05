if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
require('./config/database').connect();
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.send('<h1> Hello from Auth');
});

app.post('/register', async (req, res) => {
	try {
		const { firstname, lastname, email, password } = req.body;

		if (!(email && password && firstname && lastname)) {
			res.status(400).send('All fields are required.');
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			res.status(401).send('User already exists');
		}

		const myEncryptPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			firstname,
			lastname,
			email: email.toLowerCase(),
			password: myEncryptPassword,
		});

		//token
		const token = jwt.sign(
			{ user_id: user._id, email: user.email },
			process.env.SECRET_KEY,
			{ expiresIn: '2h' }
		);
		user.token = token;
		user.password = undefined;
		res.status(201).json(user);
	} catch (err) {
		console.log(err);
	}
});

app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email && !password) {
			res.status(400).send('All fields are required.');
		}
		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).send('User does not exists');
		}
		const isPasswordMatched = await bcrypt.compare(password, user.password);
		if (!isPasswordMatched) {
			res.status(404).send('Invalid credentials');
		}
		user.token = jwt.sign(
			{ user_id: user._id, email },
			process.env.SECRET_KEY,
			{ expiresIn: '2h' }
		);
		user.password = undefined;
		// res.status(200).json({ user });
		//i want to use cookie
		const options = {
			expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		};

		res
			.status(200)
			.cookie('token', user.token, options)
			.json({ success: true });
	} catch (err) {
		console.log(err);
	}
});

app.get('/logout', auth, (req, res) => {
	res.clearCookie('token');
	res.send('Logged out');
});

app.get('/dashboard', auth, (req, res) => {
	res.status(200).send('Welcome to secret information');
});

module.exports = app;
