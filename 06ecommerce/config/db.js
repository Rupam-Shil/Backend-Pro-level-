const mongoose = require('mongoose');

const connectWithDB = () => {
	mongoose.connect(process.env.DB_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});

	mongoose.connection
		.once('open', () => console.log('DB connected'))
		.on('error', (err) => {
			console.log(err);
			process.exit(1);
		});
};

module.exports = connectWithDB;
