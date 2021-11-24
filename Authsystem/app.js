if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const res = require('express/lib/response');

const app = express();

app.get('/', (req, res) => {
	res.send('<h1> Hello from Auth');
});

module.exports = app;
