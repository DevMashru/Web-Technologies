const express = require('express');
var qs = require('qs');
var MongoClient = require('mongodb').MongoClient
var cookieParser = require('cookie-parser');

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

app.use(function(req, res, next){
	console.log("============================")
	console.log(req.url, req.method);
	next();
})

app.get('/getcookie', function(req, res, next){
	console.log("in /getcookie")
	if(req.cookies.uname){
		console.log(req.cookies.uname)
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", req.cookies.uname, {httpOnly: false}).status(200).send(JSON.stringify({uname: req.cookies.uname}))
	}
	else{
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(200).send(JSON.stringify({uname: "none"}))
	}
	res.end();
	next();
})

app.get('/logout', function(req, res){
	console.log("in /logout")
	res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(200).send("logged out")
	res.end()
})

app.post('/register', function(req, res, next){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log('body is ' + body)
		var query = qs.parse(body);
		query.items = [];
		console.log('query is ' + JSON.stringify(query))
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				window.alert("Trouble connecting to database. Please try again sometime later");
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: query.username}, function(err, result){
					if(err){
						window.alert("Trouble accessing database. Please try again sometime later.")
					}
					else{
						var msg;
						if(result == null){
							db.collection('userdata').insertOne(query, function(err){
								if(err){
									console.log(err)
								}
								else{
									console.log('in db.insert')
									msg = JSON.stringify({msg: 'registered'})
									res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", query.username, {httpOnly: false}).status(200).send(msg)
									console.log("header set")
									console.log('cookie set')
									res.end()
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
	next();
})

app.post('/login', function(req, res, next){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log('body is ' + body)
		var query = qs.parse(body);
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				window.alert("Trouble connecting to database. Please try again sometime later");
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: query.username}, function(err, result){
					if(err){
						window.alert("Trouble accessing database. Please try again sometime later.")
					}
					else{
						var msg;
						if(result == null){
							msg = JSON.stringify({msg: 'username not found'})
							res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(404).send(msg)
							res.end()
						}
						else{
							if(query.password === result.password){
								msg = JSON.stringify({msg: 'authenticate'})
								res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", query.username, {httpOnly: false}).status(200).send(msg)
								console.log("sent " + msg)
								res.end()
							}
							else{
								msg = JSON.stringify({msg: 'wrong password'})
								res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'POST').cookie("uname", "none", {httpOnly: false}).status(404).send(msg)
								res.end()
							}
						}
					}
				})
			}
		})
	})
	next();
})

app.options('/changepwd', function(req, res, next){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log('body is ' + body)
		var query = qs.parse(body);
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'PUT').cookie("uname", query.username, {httpOnly: false}).status(200).send(JSON.stringify({msg: "send put request"}))
		res.end()
	})
	next();
})

app.options('/delacc', function(req, res){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log('body is ' + body)
		res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'DELETE').cookie("uname", "none", {httpOnly: false}).status(200).send(JSON.stringify({msg: "send delete request"}))
		res.end()
	})
})

app.put('/changepwd', function(req, res, next){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log('body is ' + body)
		var query = qs.parse(body);
		var username = req.cookies.uname
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				window.alert("Trouble connecting to database. Please try again sometime later");
			}
			else{
				var db = client.db('project');
				db.collection('userdata').findOne({username: username}, function(err, result){
					if(err){
						window.alert("Trouble accessing database. Please try again sometime later.")
					}
					else{
						var msg;
						console.log("Result is " + JSON.stringify(result))
						if(result.password !== query.oldpassword){
							msg = JSON.stringify({msg: 'incorrect existing password'})
							res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'PUT').status(200).send(msg)
							res.end()
						}
						else{
							db.collection('userdata').updateOne({username: username}, {$set: {password: query.newpassword}}, function(err){
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
						}
					}
				})
			}
		})
	})
	next()
})

app.delete('/delacc', function(req, res, next){
	var body = []
	req.on('data', function(chunk){
		body.push(chunk)
	})
	req.on('end', function(){
		body = Buffer.concat(body).toString()
		console.log("body is " + body)
		var query = qs.parse(body)
		MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, function(err, client){
			if(err){
				res.send(err)
				res.end()
			}
			else{
				var db = client.db('project')
				db.collection('userdata').deleteOne({username: query.username}, function(err){
					if(err){
						res.send(err)
						res.end()
					}
					else{
						var msg = JSON.stringify({msg: 'deleted'})
						res.set('Access-Control-Allow-Credentials', 'true').set('Access-Control-Allow-Origin', 'http://localhost:3000').set('Access-Control-Allow-Methods', 'DELETE').cookie("uname", "none", {httpOnly: false}).status(200).send(msg)
						console.log("deleted " + query.username)
						res.end()
					}
				})
			}
		})
	})
	next()
})

app.use(function(req, res){
	console.log("Cookies are: " + JSON.stringify(req.cookies))
})


app.listen(8080, () => {
	console.log("Server up and running on localhost:8080");
});