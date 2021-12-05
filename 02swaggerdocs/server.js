const express = require('express');
const res = require('express/lib/response');

const app = express();
app.use(express.json());

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

app.get('/api/v1/rupamobject', (req, res) => {
	res.json({
		id: '21',
		name: 'learn vuejs',
		price: 399,
	});
});
app.get('/api/v1/courses', (req, res) => {
	res.json(courses);
});
app.get('/api/v1/mycourse/:courseId', (req, res) => {
	const myCourse = courses.find((course) => course.id === req.params.courseId);
	myCourse ? res.json(myCourse) : res.json({ err: 'not found' });
});

app.listen(4000, () => console.log('Server running on port 4000'));
