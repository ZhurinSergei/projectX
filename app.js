const express = require("express");
const MongoClient = require('mongodb').MongoClient; 

const app = express();
const url = "mongodb://localhost:27017/";
MongoClient.connect(url, (err, db) => {
	if (err) 
		return console.log(err);
	  
	require('./app/routes')(app, db);
	
	app.listen(3000, () => {
		console.log('Server start');
	});               
}); 
