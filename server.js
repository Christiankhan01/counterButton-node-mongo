const dotenv = require('dotenv').config();
console.log('Server up and running...');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

//Serve up files from public directory 
app.use(express.static('public'));

let db;

const url = process.env.MONGO_URI

MongoClient.connect(url, (err, database) => {
	console.log("works"); 
	if (err) {
		return console.log(err);
	}
	db = database;
	//start express web server on port 8080
	app.listen(8080, () => {
		console.log('listening on 8080');
	});
});

//serve up the homepage
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

//add a document to DB collection recorded click event 
app.post('/clicked', (req, res) => {
	const click = {clickTime: new Date()}; 
	console.log(click); 
	console.log(db); 
	
	db.collection('clicks').save(click, (err, result) => {
		if(err) {
			return console.log(err); 
		}
		console.log('click added to db'); 
		res.sendStatus(201); 
	}); 
}); 
// get the click data from the database
app.get('/clicks', (req, res) => {

	db.collection('clicks').find().toArray((err, result) => {
	  if (err) return console.log(err);
	  res.send(result);
	});
  });





