const express = require('express');

const mongoose = require('mongoose');

const app = express();
const router = express.Router()

function fill(d,res){
	return res.send(d);
}

router.post('/api/top', (req, res) => {
	var d = []
	mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	db.once('open', () => {
		db.collection('top').find({}).toArray((err,r) => {
			if(err) throw err;
			r.forEach(obj => {
				if (obj.Amazon && obj.Flipkart) {
					if (obj.Amazon.price.slice(-1)[0].price < obj.Flipkart.price.slice(-1)[0].price) {
						d.push({name: obj.Name, price: obj.Amazon.price.slice(-1)[0].price, lowestprice: obj.Amazon.lowestprice, highestprice: obj.Amazon.highestprice, link: obj.Amazon.link})
					}
					else
						d.push({name: obj.Name, price: obj.Flipkart.price.slice(-1)[0].price, lowestprice: obj.Flipkart.lowestprice, highestprice: obj.Flipkart.highestprice, link: obj.Flipkart.link})
				}
				else if (obj.Amazon) {
					d.push({name: obj.Name, price: obj.Amazon.price.slice(-1)[0].price, lowestprice: obj.Amazon.lowestprice, highestprice: obj.Amazon.highestprice, link: obj.Amazon.link})
				}
				else if (obj.Flipkart) {
					d.push({name: obj.Name, price: obj.Flipkart.price.slice(-1)[0].price, lowestprice: obj.Flipkart.lowestprice, highestprice: obj.Flipkart.highestprice, link: obj.Flipkart.link})
				}
				if (d.length === r.length) {
					fill(d,res)
				}
			});
		});
	});
});

module.exports = router;