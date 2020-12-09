const mongoose = require('mongoose');

const nodemailer = require('nodemailer'); 

function sendEmail(store, email, name, price){
	let mailTransporter = nodemailer.createTransport({ 
		service: 'gmail', 
		auth: { 
			user: 'pricetracker.pes@gmail.com', 
			pass: '********'	//replace with real password
		} 
	});

	let mailDetails = { 
		from: 'pricetracker.pes@gmail.com', 
		to: email, 
		subject: name + ' price drop alert', 
		text: name + ' is selling for ' + price + ' on ' + store
		};
	
	mailTransporter.sendMail(mailDetails, function(err, data) { 
		if(err) { 
			console.log('Error Occurs'); 
		} else { 
			console.log('Email sent successfully'); 
		}
	});
}

function Email(){
	mongoose.disconnect();
	mongoose.connect('mongodb://localhost:27017/project', {useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;
	db.once('open',() => {
		db.collection('top').find({}).toArray((err,res) => {
			if(err) throw err;
			db.collection('userdata').find({}).toArray((err,r) => {
				if(err) throw err;
				res.forEach(item => {
					r.forEach(user => {
						var email = user.email;
						if(email){
							user.items.forEach(i => {
								if(item.Name === i.name){
									mp = i.minimumprice;
									if(item.Amazon && item.Flipkart){
										if(item.Amazon.price.slice(-1)[0].price <= mp){
											mp = item.Amazon.price.slice(-1)[0].price;
										}
										if(item.Flipkart.price.slice(-1)[0].price <= mp){
											sendEmail('Flipkart', email, item.Name, item.Flipkart.price.slice(-1)[0].price);
										}
										else{
											sendEmail('Amazon', email, item.Name, item.Amazon.price.slice(-1)[0].price);
										}
									}
									else if(item.Amazon){
										if(item.Amazon.price.slice(-1)[0].price <= i.minimumprice){
											sendEmail('Amazon', email, item.Name, item.Amazon.price.slice(-1)[0].price);
										}
									}
									else if(item.Flipkart){
										if(item.Flipkart.price.slice(-1)[0].price <= i.minimumprice){
											sendEmail('Flipkart', email, item.Name, item.Flipkart.price.slice(-1)[0].price);
										}
									}
								}
							});
						}
					});
				});
			});
		});
	});
}

setInterval(Email,3600000);
