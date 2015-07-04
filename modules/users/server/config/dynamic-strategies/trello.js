/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
TrelloStrategy = require('passport-trello').Strategy,
User = require('mongoose').model('User'),
users = require('../../controllers/users.server.controller');

module.exports = function (provider) {
	// Use github strategy
	passport.use(provider.name, new TrelloStrategy({
			consumerKey: provider.clientID,
			consumerSecret: provider.clientSecret,
			callbackURL: '/api/auth/' + provider.name + '/callback',
			passReqToCallback: true,
			trelloParams: {
				scope     : 'read,write',
				name      : 'MyApp',
				expiration: 'never'
			}

},
		function (req, accessToken, refreshToken, profile, done) {
			console.log('USE STRATEGY TRELLO');
			// Set the provider data and include tokens
			var providerData = profile._json;

			// Create the user OAuth profile
			var displayName = profile.displayName.trim();
			var iSpace = providerData.fullName.indexOf(' '); // index of the whitespace following the firstName
			var firstName = iSpace !== -1 ?  providerData.fullName.substring(0, iSpace) :  providerData.fullName;
			var lastName = iSpace !== -1 ?  providerData.fullName.substring(iSpace + 1) : '';

			var userData = {
				firstName: firstName,
				lastName: lastName,
				displayName: displayName,
				email: profile.emails[0].value,
				username: profile.username,
				profileImageURL: (providerData.avatar_url) ? providerData.avatar_url : undefined,
				provider: provider.name,
				providerIdentifierField: 'id',
				providerData: providerData,
				uri: providerData.url
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, provider.name, providerData.id, accessToken, refreshToken, providerData, userData, function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};

