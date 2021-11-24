if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
require('./config/database').connect();
const express = require('express');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	res.send('<h1> Hello from Auth');
});

app.post('/register', async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	if (!(email && password && firstName && lastName)) {
		res.status(400).send('All fields are required.');
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		res.status(401).send('User already exists');
	}
});

module.exports = app;
