exports.testProduct = (req, res) => {
	res.status(200).json({
		success: true,
		greeting: 'This is another dummy route for product',
	});
};
