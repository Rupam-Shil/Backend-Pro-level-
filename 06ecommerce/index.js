if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const app = require('./app');

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port no ${process.env.PORT}`);
});
