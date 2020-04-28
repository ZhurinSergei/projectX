const tokenRoutes = require('./token_routes');

module.exports = function(app, db) {
	tokenRoutes(app, db);
};