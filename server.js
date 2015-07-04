/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var config   = require('./config/config'),
	mongoose = require('./config/lib/mongoose'),
	express  = require('./config/lib/express'),
	orient   = require('./config/lib/orient.js'),
	q        = require('q'),
	def      = q.defer();

orient.connect(function () {
// Initialize mongoose
	mongoose.connect(function (db) {
		// Initialize express
		var app = express.init(db);

		// Start the app by listening on <port>
		var server = app.listen(config.port);

		// Logging initialization
		console.log('MEAN.JS application started on port ' + config.port);

		def.resolve(server);
	});
});

module.exports = def.promise;
