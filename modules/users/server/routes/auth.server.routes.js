/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../controllers/users.server.controller');

	app.route('/api/auth').get(users.availableProviders);

	// Setting up the users password api
	app.route('/api/auth/forgot').post(users.forgot);
	app.route('/api/auth/reset/:token').get(users.validateResetToken);
	app.route('/api/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/api/auth/signup').post(users.signup);
	app.route('/api/auth/signin').post(users.signin);
	app.route('/api/auth/signout').get(users.signout);

	app.route('/api/auth/:oauthProvider').get(users.oauthAccept);
	app.route('/api/auth/:oauthProvider/callback').get(users.oauthCallback);
	app.param('oauthProvider', users.oauthProviderByName);
};
