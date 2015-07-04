/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LinkedInStrategy = require('passport-linkedin').Strategy,
	User = require('mongoose').model('User'),
	users = require('../../controllers/users.server.controller.js');

module.exports = function (config) {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			passReqToCallback: true,
			profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
		},
		function (req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;

			// Create the user OAuth profile
			var userData = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				profileImageURL: (providerData.pictureUrl) ? providerData.pictureUrl : undefined,
				provider: 'linkedin',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, 'linkedin', providerData.id, accessToken, refreshToken, providerData, userData, function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};
