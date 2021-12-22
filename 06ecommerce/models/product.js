const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Please provide product name'],
		trim: true,
		maxlength: [120, 'Product name should not be 120 characters'],
	},
	price: {
		type: Number,
		required: [true, 'Please provide product price'],
	},
	description: {
		type: String,
		required: [true, 'Please provide product description'],
	},
	photos: [
		{
			id: {
				type: String,
				required: true,
			},
			public_url: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [
			true,
			'Please select category from - short-sleeves, long-sleeves, sweat-shirts, hoodies',
		],
		enum: {
			values: ['shortsleeves', 'longsleeves', 'sweatshirts', 'hoodies'],
			message:
				'Please select category only - short-sleeves, long-sleeves, sweat-shirts, hoodies',
		},
	},
	brand: {
		type: String,
		required: [true, 'Please add a brand for clothing'],
	},
	ratings: {
		type: Number,
		default: 0,
	},
	numberOfReviews: {
		type: Number,
		default: 0,
	},
	reviews: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: 'users',
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			rating: {
				type: Number,
				required: true,
			},
			comment: {
				type: String,
				required: true,
			},
		},
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'users',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
