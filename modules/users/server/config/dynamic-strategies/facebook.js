/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('mongoose').model('User'),
	users = require('../../controllers/users.server.controller.js');

module.exports = function (config) {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
			passReqToCallback: true
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
				profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
				provider: 'facebook',
				providerIdentifierField: 'id',
				providerData: providerData,
				username: profile.displayName
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, 'facebook', providerData.id, accessToken, refreshToken, providerData, userData, function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};
