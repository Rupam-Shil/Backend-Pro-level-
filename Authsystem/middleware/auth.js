const jwt = require('jsonwebtoken');

//model is optional here
const auth = (req, res, next) => {
	console.log(req.cookies);
	const token =
		req.cookies.token ||
		req.header('Authorization').replace('Bearer ', '') ||
		req.body.token;
	if (!token) {
		res.status(403).send('token is missing');
	}

	try {
		const decode = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decode;
	} catch (err) {
		return res.status(401).send('Invalid token');
	}
	return next();
};
module.exports = auth;
