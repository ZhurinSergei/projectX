module.exports = function(app, db) {
	app.get('/tokens', (req, res) => {
		const status = req.query['status'];	
		const details = status != undefined ? {status: status} : {};

		db.collection('tokens').find(details).toArray((err, result) => {
			if (err) throw err;
			res.send(result);
		});
	});
};