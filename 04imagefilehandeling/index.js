const express = require('express');
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'drzmwt0j1',
	api_key: '972634474245829',
	api_secret: '3FTT7EiDbbtgDHY45dlVbdt7CkU',
});

const app = express();
app.use(express.json());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
	})
);
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/myget', (req, res) => {
	console.log(req.body);
	res.send(req.query);
});

app.get('/mygetform', (req, res) => {
	res.render('getform');
});
app.get('/mypostform', (req, res) => {
	res.render('postform');
});
app.post('/mypost', async (req, res) => {
	const { firstname, lastname } = req.body;
	console.log(req.files);
	let result;
	let imageArray = [];

	//for multipleImage
	if (req.files) {
		for (let i = 0; i < req.files.samplefile.length; i++) {
			let result = await cloudinary.uploader.upload(
				req.files.samplefile[i].tempFilePath,
				{
					folder: 'users',
				}
			);
			imageArray.push({
				public_id: result.public_id,
				secure_url: result.secure_url,
			});
		}
	}

	//## for single images
	// let file = req.files.samplefile;
	//  result = await cloudinary.uploader.upload(file.tempFilePath, {
	// 	folder: 'users',
	// });
	console.log(imageArray);
	details = {
		firstname,
		lastname,
		imageArray,
		result,
	};
	res.send(details);
});
app.listen(9000, () => console.log('Listening on port 9000'));
