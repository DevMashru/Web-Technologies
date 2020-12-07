const cheerio = require('cheerio');
const request = require('request');

const mongoose = require('mongoose');

function getDB(){
	mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	return db;
}

function top() {
	mongoose.disconnect();
	db = getDB();
	db.once('open', () => {
		db.collection('top').find({}).toArray((err,res) => {
			if(err) throw err;
			res.forEach(obj => {
				if (obj.Amazon) {
					amazon(obj.Amazon);
				}
				if (obj.Flipkart) {
					flipkart(obj.Flipkart);
				}
			});
		});
	})
}

function amazon(Amazon){
	request(Amazon.link, (err, res, body) => {
		if(err) throw err;
		const $ = cheerio.load(body);
		var price = $('#priceblock_dealprice').text();
		if (!price) {
			price = $('#priceblock_ourprice').text();
		}
		if(!price){
			price = 'N/A';
		}
		var strippedPrice = price.replace('₹', '').replace(',', '').replace(',', '');
		insert("Amazon", strippedPrice, Amazon.link);
		if('highestprice' in Amazon){
			highest("Amazon", strippedPrice, Amazon.link)
			lowest("Amazon", strippedPrice, Amazon.link);
		}
		else{
			if(strippedPrice > Amazon.highestprice)
				highest("Amazon", strippedPrice, Amazon.link);
			else if(strippedPrice < Amazon.lowestprice)
				lowest("Amazon", strippedPrice, Amazon.link);
		}
	})
}

function flipkart(Flipkart){
	request(Flipkart.link, (err, res, body) => {
		if(err) throw err;
		const $ = cheerio.load(body);
		var price = $('div._30jeq3._16Jk6d').text();
		if(!price){
			price = 'N/A';
		}
		var strippedPrice = price.replace('₹', '').replace(',', '').replace(',', '');
		insert("Flipkart", strippedPrice, Flipkart.link);
		if('highestprice' in Flipkart){
			highest("Flipkart", strippedPrice, Flipkart.link)
			lowest("Flipkart", strippedPrice, Flipkart.link);
		}
		else{
			if(strippedPrice > Flipkart.highestprice)
				highest("Flipkart", strippedPrice, Flipkart.link);
			else if(strippedPrice < Flipkart.lowestprice)
				lowest("Flipkart", strippedPrice, Flipkart.link);
		}
	})
}

function highest(store, price, link){
	price = parseFloat(price);
	if(isNaN(price))
	return
	if(store === "Amazon")
		db.collection('top').findOneAndUpdate({'Amazon.link' : link}, {$set: {'Amazon.highestprice': price}});
	else
		db.collection('top').findOneAndUpdate({'Flipkart.link' : link}, {$set: {'Flipkart.highestprice': price}});
}

function lowest(store, price, link){
	price = parseFloat(price);
	if(isNaN(price))
	return
	if(store === "Amazon")
		db.collection('top').findOneAndUpdate({'Amazon.link' : link}, {$set: {'Amazon.lowestprice': price}});
	else
		db.collection('top').findOneAndUpdate({'Flipkart.link' : link}, {$set: {'Flipkart.lowestprice': price}});
}

function insert(store, price, link){
	price = parseFloat(price);
	if(isNaN(price))
	return
	if(store === "Amazon")
		db.collection('top').findOneAndUpdate({'Amazon.link' : link}, {$push: {'Amazon.price': {'Date': new Date(), 'price': price}}});
	else
		db.collection('top').findOneAndUpdate({'Flipkart.link' : link}, {$push: {'Flipkart.price': {'Date': new Date(), 'price': price}}});
}

setInterval(top,3600000);