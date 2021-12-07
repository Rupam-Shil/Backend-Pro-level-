if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const app = require('./app');

//db connection
const connectWithDB = require('./config/db');
connectWithDB();

//cloudinary
const cloudinary = require('cloudinary').v2;

//config of cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINAEY_NAME,
	api_key: process.env.CLOUDINAEY_API_KEY,
	api_secret: process.env.CLOUDINAEY_API_SECRET,
});
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port no ${process.env.PORT}`);
});
