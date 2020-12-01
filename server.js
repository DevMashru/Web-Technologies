const express = require('express');

const app = express();

app.use(express.static('static'))

const api = require('./api/api');

app.post('/api/top',api);

app.listen(3000, () => {
	console.log("Server up and running on localhost:3000");
});