module.exports = function(app, db) {
	app.get('/tokens', (req, res) => {
		db.collection('tokens').find().toArray((err, result) => {
			if (err) throw err;
			res.send(result);
		});
	});
};