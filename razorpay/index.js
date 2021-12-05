const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('up and running');
});

app.post('/order', async (req, res) => {
	const { ammount } = req.body;

	var instance = new Razorpay({
		key_id: 'YOUR_KEY_ID',
		key_secret: 'YOUR_SECRET',
	});

	var options = {
		amount: amount * 100,
		currency: 'INR',
		receipt: 'receipt#1',
	};

	// instance.orders.create(ooptions, (err, order) => {
	//     console.log(order);
	// });

	const myOrder = await instance.orders.create(options);

	res.status(201).json({
		success: true,
		ammount: ammount * 100,
		order: myOrder,
	});
});

app.listen(9000, () => console.log('Listening on port 9000'));
