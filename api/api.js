const express = require('express');

const app = express();
const router = express.Router()

router.post('/api/top', (req, res) => {
	const d = [ {name: 'Pixel 3', price: '60000'},
	{name: 'Pixel 4a', price: '30000'},
	{name: 'iPhone SE2', price: '45000'},
	{name: 'iPhone 12', price: '75000'}
	];
	return res.send(d);
});

module.exports = router;