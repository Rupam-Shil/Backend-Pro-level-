const express = require('express');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'public');

app.listen(9000, () => console.log('Listening on port 9000'));
