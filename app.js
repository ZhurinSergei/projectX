const express = require("express");
const MongoClient = require('mongodb').MongoClient; 

const app = express();
const url = "mongodb://localhost:27017/";
MongoClient.connect(url, (err, client) => {
	if (err) return console.log(err);
	  
	require('./app/routes')(app, client.db('api'));
	
	app.listen(3000, () => {
		console.log('Server start');
	});               
}); 
