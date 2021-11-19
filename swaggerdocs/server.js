const express = require('express');
const res = require('express/lib/response');

const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let courses = [
	{
		id: '11',
		name: 'learn reactjs',
		price: 299,
	},
	{
		id: '21',
		name: 'learn vuejs',
		price: 399,
	},
	{
		id: '31',
		name: 'learn angularjs',
		price: 499,
	},
];

// const swaggerUi
app.get('/', (req, res) => {
	res.send('Welcome to swagger docs');
});

app.get('/api/v1/rupam', (req, res) => {
	res.send("Hello from Rupam's end!!");
});

app.listen(4000, () => console.log('Server running on port 4000'));
