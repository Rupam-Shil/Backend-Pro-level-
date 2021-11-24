const mongoose = require('mongoose');

exports.connect = () => {
	mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoose.connection
		.once('open', () => {
			console.log('DB connected');
		})
		.on('error', (err) => {
			console.log('DB connection failed');
			console.log('Failed');
			process.exit(1);
		});
};
