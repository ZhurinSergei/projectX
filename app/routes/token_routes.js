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
		const parcel = { token: req.body.token, status: req.body.status };
		
		db.collection('parcels').insert(parcel, (err, result) => {
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
		
		db.collection('parcels').remove(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send('Note ' + id + ' deleted!');
			} 
		});
	});
	
	app.put ('/parcels/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		const parcel = { text: req.body.body, title: req.body.title };
		
		db.collection('parcels').update(details, parcel, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(parcel);
			} 
		});
	});
};
