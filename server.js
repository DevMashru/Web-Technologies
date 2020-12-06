const express = require('express');
var qs = require('qs');
var MongoClient = require('mongodb').MongoClient
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt')

const app = express();

const api = require('./api/api');

app.post('/api/top',api, (req, res, next) => {
	next();
});

app.post('/api/add',api, (req, res, next) => {
	next();
});

app.options('/api/deleteItem',api, (req, res, next) => {
	next();
});

app.delete('/api/deleteItem',api, (req, res, next) => {
	next();
});

app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.get('/getcookie', function(req, res){
	if(req.cookies.uname){
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", req.cookies.uname, {httpOnly: false}).status(200).send(JSON.stringify({uname: req.cookies.uname}))
	}
	else{
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(200).send(JSON.stringify({uname: "none"}))
	}
	res.end();
})

app.get('/logout', function(req, res){
	res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(200).send("logged out")
	res.end()
})

app.post('/register', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		query.items = [];
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				console.log(err)
				res.status(404).end()
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: query.username}, function(err, result){
					if(err){
						console.log(err)
						res.status(404).end()
					}
					else{
						var msg;
						if(result == null){
							bcrypt.hash(query.password, 10, function(err, hash){
								if(err){
									console.log(err)
									res.status(404).send()
								}
								else{
									db.collection('userdata').insertOne({username: query.username, password: hash, email: query.email}, function(err){
										if(err){
											console.log(err)
											res.status(404).end()
										}
										else{
											msg = JSON.stringify({msg: 'registered'})
											res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", query.username, {httpOnly: false}).status(200).send(msg)
											res.end()
										}
									})
								}
							})
						}
						else{
							msg = JSON.stringify({msg: 'user exists'})
							res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(404).send(msg)
							res.end()
						}
					}
				})
			}
		})
	})
})

app.post('/login', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				console.log(err)
				res.status(404).end()
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: query.username}, function(err, result){
					if(err){
						console.log(err)
						res.status(404).end()
					}
					else{
						var msg;
						if(result == null){
							msg = JSON.stringify({msg: 'username not found'})
							res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(404).send(msg)
							res.end()
						}
						else{
							bcrypt.compare(query.password, result.password, function(err, result){
								if(result){
									msg = JSON.stringify({msg: 'authenticate'})
									res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", query.username, {httpOnly: false}).status(200).send(msg)
									res.end()
								}
								else{
									msg = JSON.stringify({msg: 'wrong password'})
									res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(404).send(msg)
									res.end()
								}
							})
						}
					}
				})
			}
		})
	})
})

app.options('/changepwd', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'PUT').cookie("uname", query.username, {httpOnly: false}).status(200).send(JSON.stringify({msg: "send put request"}))
		res.end()
	})
})

app.options('/delacc', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'DELETE').cookie("uname", "none", {httpOnly: false}).status(200).send(JSON.stringify({msg: "send delete request"}))
		res.end()
	})
})

app.put('/changepwd', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body);
		var username = req.cookies.uname
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				console.log(err)
				res.status(404).end()
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: username}, function(err, result){
					if(err){
						console.log(err);
						res.status(404).end()
					}
					else{
						var msg;
						bcrypt.compare(query.oldpassword, result.password, function(err, result){
							if(!result){
								msg = JSON.stringify({msg: 'incorrect existing password'})
								res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'PUT').status(200).send(msg)
								res.end()
							}
							else{
								bcrypt.hash(query.newpassword, 10, function(err, hash){
									db.collection('userdata').updateOne({username: username}, {$set: {password: hash}}, function(err){
										if(err){
											res.writeHead(404, {'Content-type': 'text/plain', 'Access-Control-Allow-Origin': 'http://localhost:3000'})
											msg = JSON.stringify({msg: 'update failed'})
											res.send(msg)
											res.end()
										}
										else{
											msg = JSON.stringify({msg: 'password updated successfully'})                                
											res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", query.username, {httpOnly: false}).status(200).send(msg)
											res.end()
										}
									})
								})
								
							}
						})
					}
				})
			}
		})
	})
})

app.delete('/delacc', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		var query = qs.parse(body)
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				console.log(err)
				res.status(404).end()
			}
			else{
				var db = client.db('project')
				db.collection('userdata').deleteOne({username: query.username}, function(err){
					if(err){
						console.log(err)
						res.status(404).end()
					}
					else{
						var msg = JSON.stringify({msg: 'deleted'})
						res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'DELETE').cookie("uname", "none", {httpOnly: false}).status(200).send(msg)
						res.end()
					}
				})
			}
		})
	})
})

app.listen(8080, () => {
	console.log("Server up and running on localhost:8080");
});