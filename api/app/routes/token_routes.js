var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	app.get('/parcels', (req, res) => {
		const status = req.query['status'];	
		const details = status != undefined ? {status: status} : {};

		db.collection('parcels').find(details).toArray((err, result) => {
			if (err) throw err;
			res.send(result);
		});
	});
	
	app.post('/parcels', (req, res) => {
		if(!req.body) return res.sendStatus(400);

		const parcel = {
			userId: req.body.userId, 
			token: req.body.token, 
			status: req.body.status 
			};

		db.collection('parcels').insertOne(parcel, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send(result.ops[0]);
			}
		});
	});
	
	app.delete('/parcels/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		
		db.collection('parcels').deleteOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(id + ':deleted!');
			} 
		});
	});
	
	app.put ('/parcels/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		const parcel = {
			userId: req.body.userId, 
			token: req.body.token, 
			status: req.body.status 
			};
		
		db.collection('parcels').updateOne(details, parcel, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(parcel);
			} 
		});
	});
};
