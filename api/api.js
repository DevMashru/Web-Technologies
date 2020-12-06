const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const qs = require('querystring');

const app = express();
const router = express.Router()

router.use(cookieParser())

function getDB() {
	mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	return db;
}

function fill(d,res){
	res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'https://fgkekkthnxbai.hforms.me').set('Access-Control-Allow-Methods', 'POST');
	return res.send(d);
}

router.post('/api/top', (req, res) => {
	var d = []
	mongoose.disconnect()
	const db = getDB();
	var lowestprice, highestprice;
	db.once('open', () => {
		db.collection('userdata').findOne({username: req.cookies.uname}, (err,re) => {
			if(err) throw err;
			db.collection('top').find({}).toArray((err,r) => {
				if(err) throw err;
				re.items.forEach(item => {
					r.forEach(obj => {
						if(item.name === obj.Name){
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

router.post('/api/add', (req, res) => {
	mongoose.disconnect();
	const db = getDB();
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		amazon = query.alink;
		flipkart = query.flink;
		db.once('open', () => {
			db.collection('userdata').findOneAndUpdate({username: req.cookies.uname}, {$push: {items: {name: query.name, minimumprice: query.minimum}}});
			db.collection('top').findOne({Name: query.name}, (err,r) => {
				if(err) throw err;
				if(!r){
					if(amazon && flipkart){
						db.collection('top').insertOne({Name: query.name, Amazon: {link: amazon, price:[]}, Flipkart: {link: flipkart, price:[]}});
					}
					else if(amazon){
						db.collection('top').insertOne({Name: query.name, Amazon: {link: amazon, price:[]}});
					}
					else if(flipkart){
						db.collection('top').insertOne({Name: query.name, Flipkart: {link: flipkart, price:[]}});
					}
				}
				res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'https://fgkekkthnxbai.hforms.me').set('Access-Control-Allow-Methods', 'POST');
				return res.send(200);
			});
		});
	});
});

router.options('/api/deleteItem', (req, res, next) => {
	req.on('data', () => {})
	req.on('end', () => {
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'https://fgkekkthnxbai.hforms.me').set('Access-Control-Allow-Methods', 'DELETE').cookie("uname", req.cookies.uname, {httpOnly: false})//.status(200).send(JSON.stringify({msg: "send delete request"}))
		res.end()
	})
});

router.delete('/api/deleteItem', (req, res) => {
	mongoose.disconnect();
	const db = getDB();
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	});
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		db.once('open' ,() => {
			db.collection('userdata').updateOne({username: req.cookies.uname}, {$pull: { items: {name: body } }})
		});
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'https://fgkekkthnxbai.hforms.me').set('Access-Control-Allow-Methods', 'DELETE');
		return res.send(200);
	});
});

module.exports = router;