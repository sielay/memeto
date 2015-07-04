/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	SlackStrategy = require('passport-slack').Strategy,
	User = require('mongoose').model('User'),
	users = require('../../controllers/users.server.controller.js');

module.exports = function (provider) {
	// Use github strategy
	passport.use(new SlackStrategy({
			clientID: provider.clientID,
			clientSecret: provider.clientSecret,
			callbackURL: '/api/auth/' + provider.name + '/callback',
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {
			console.log('USE STRATEGY SLACK');
			// Set the provider data and include tokens
			var providerData = profile._json;

			// Create the user OAuth profile
			var displayName = providerData.user.trim();

			console.log(providerData);

			var userData = {
				displayName: displayName,
				username: providerData.user,
				provider: 'slack',
				providerIdentifierField: 'user',
				providerData: providerData
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, 'slack', providerData.user, accessToken, refreshToken, providerData, userData, function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};
