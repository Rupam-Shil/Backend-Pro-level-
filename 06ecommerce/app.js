const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//swagger docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie and file middleware
app.use(cookieParser());
app.use(fileUpload());

//morgan middleware
app.use(morgan('tiny'));
//import all routes here
const home = require('./routes/home');

app.use('/api/v1', home);

//export
module.exports = app;
