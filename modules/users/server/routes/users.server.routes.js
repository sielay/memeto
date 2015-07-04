/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

module.exports = function (app) {
	// User Routes
	var usersPolicy = require('../policies/users.server.policy');
	var users = require('../controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/api/users/me').get(usersPolicy.isAllowed, users.me);
	app.route('/api/users/:userId').get(usersPolicy.isAllowed, users.read);
	app.route('/api/users')
		.get(usersPolicy.isAllowed, users.users)
		.put(users.update);
	app.route('/api/users/accounts').delete(usersPolicy.isAllowed, users.removeOAuthProvider);
	app.route('/api/users/password').post(usersPolicy.isAllowed, users.changePassword);
	app.route('/api/users/picture').post(usersPolicy.isAllowed, users.changeProfilePicture);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
