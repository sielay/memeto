/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport  = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User          = require('mongoose').model('User');

module.exports = function () {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		}, module.exports.handler(User)
	));
};

module.exports.handler = function (User) {
	return function (username, password, done) {
		User.findByProvider([User.USERNAME, User.EMAIL], username, function (err, user) {
			if (err) return done(err);

			if (!user || !user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid username or password'
				});
			}

			return done(null, user);
		});
	};
};
