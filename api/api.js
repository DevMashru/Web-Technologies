const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router()

router.use(cookieParser())

function fill(d,res){
	res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST');
	return res.send(d);
}

router.post('/api/top', (req, res) => {
	var d = []
	mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	var lowestprice, highestprice;
	db.once('open', () => {
		db.collection('userdata').findOne({username: req.cookies.uname}, (err,re) => {
			if(err) throw err;
			db.collection('top').find({}).toArray((err,r) => {
				if(err) throw err;
				re.items.forEach(item => {
					r.forEach(obj => {
						if(item === obj.Name){
							if (obj.Amazon && obj.Flipkart) {
								if(obj.Amazon.lowestprice < obj.Flipkart.lowestprice){
									lowestprice = obj.Amazon.lowestprice;
								}
								else{
									lowestprice = obj.Flipkart.lowestprice;
								}
								if(obj.Amazon.highestprice > obj.Flipkart.highestprice){
									highestprice = obj.Amazon.highestprice;
								}
								else{
									highestprice = obj.Flipkart.highestprice;
								}
								d.push({name: obj.Name, Fprice: obj.Flipkart.price.slice(-1)[0].price, Aprice: obj.Amazon.price.slice(-1)[0].price, lowestprice: lowestprice, highestprice: highestprice, Flink: obj.Flipkart.link, Alink: obj.Amazon.link})
							}
							else if (obj.Amazon) {
									lowestprice = obj.Amazon.lowestprice;
									highestprice = obj.Amazon.highestprice;
									d.push({name: obj.Name, Fprice: 'N/A', Aprice: obj.Amazon.price.slice(-1)[0].price, lowestprice: lowestprice, highestprice: highestprice, Alink: obj.Amazon.link})
							}
							else if (obj.Flipkart) {
								lowestprice = obj.Flipkart.lowestprice;
								highestprice = obj.Flipkart.highestprice;
								d.push({name: obj.Name, Fprice: obj.Flipkart.price.slice(-1)[0].price, Aprice: 'N/A', lowestprice: lowestprice, highestprice: highestprice, Flink: obj.Flipkart.link})
							}
							if (d.length === re.items.length) {
								fill(d,res)
								mongoose.disconnect();
							}
						}
					});
				});
			});
		});
	});
});

module.exports = router;