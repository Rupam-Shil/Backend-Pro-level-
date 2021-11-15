import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import format from 'date-format';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).send('<h1> Hello there </h1>');
});

app.get('/api/v1/instagram', (req, res) => {
	// try {
	// const { data } = await axios.get('http://instagram.com/thesyntacticsugar');
	// const $ = cheerio.load(data);
	// 	const instaSocial = {
	// 		followers: $('.zwlfE .Y8-fY  .-nal3 .g47SY ').html(),
	// 	};
	// 	res.status(200).json(instaSocial);
	// } catch (err) {
	// 	console.error(err);
	// }
	const instaSocial = {
		username: 'imrupamshil',
		followers: 589,
		following: 19,
	};
	res.status(200).json(instaSocial);
});
app.get('/api/v1/facebook', (req, res) => {
	// try {
	// const { data } = await axios.get('http://instagram.com/thesyntacticsugar');
	// const $ = cheerio.load(data);
	// 	const instaSocial = {
	// 		followers: $('.zwlfE .Y8-fY  .-nal3 .g47SY ').html(),
	// 	};
	// 	res.status(200).json(instaSocial);
	// } catch (err) {
	// 	console.error(err);
	// }
	const fbSocial = {
		username: 'Rupam-Shil',
		followers: 100,
		following: 30,
		date: format.asString('dd[MM] - hh:mm:ss', new Date()),
	};
	res.status(200).json(fbSocial);
});

app.get('/user/:id', (req, res) => {
	const { id } = req.params;
	res.status(200).send(id);
});

app.listen(PORT, () => {
	console.log(`Listening on port no ${PORT}`);
});
