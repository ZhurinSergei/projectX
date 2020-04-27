const express = require("express");
const MongoClient = require('mongodb').MongoClient; 
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const url = "mongodb://localhost:27017/";
MongoClient.connect(url, (err, client) => {
	if (err) return console.log(err);
	  
	require('./app/routes')(app, client.db('api'));
	
	app.listen(3000, () => {
		console.log('Server start');
	});               
}); 
