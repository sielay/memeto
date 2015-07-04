/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/

'use strict';

var should                 = require('should'),
	strategy               = require('../../../server/config/dynamic-strategies/github'),
	accessTokenValidNew    = 'accessTokenValidNew',
	accessTokenValidExists = 'accessTokenValidExists',
	profile                = {
		id:          '123456',
		displayName: 'Ted the Bear',
		emails:      [{
			value: 'ted@bazinga.com'
		}],
		username:    'theted',
		_json:       {
			id:         '123456',
			avatar_url: 'scarletjohannson.png',
			url:        'http://lovelovelove'
		}
	},
	UserMockup             = {
		oAuthHandle: function (userObject, providerName, providerDataId, accessToken, refreshToken, providerData, userData, callback) {
			try {
				should(userObject).eql('Ted');
				should(providerName).eql('github-enterprise');
				should(providerDataId).eql(profile.id);
				should(refreshToken).eql('refreshToken');

				var profileExp = {
					firstName:               'Ted',
					lastName:                'the Bear',
					displayName:             'Ted the Bear',
					email:                   'ted@bazinga.com',
					username:                'theted',
					profileImageURL:         'scarletjohannson.png',
					provider:                'github-enterprise',
					providerIdentifierField: 'id',
					providerData:            {
						id:         '123456',
						avatar_url: 'scarletjohannson.png',
						url:        'http://lovelovelove'
					},
					uri:                     'http://lovelovelove'
				};

				should(userData).eql(profileExp);
				should(providerData).eql({
					id:         '123456',
					avatar_url: 'scarletjohannson.png',
					url:        'http://lovelovelove'
				});
			} catch (ex) {
				return callback(ex);
			}
			callback(null, userData, accessToken === accessTokenValidNew);
		}
	},
	provider               = {
		name: 'github-enterprise'
	};

describe('GitHub dynamic passport strategy', function () {
	it('Handles valid token for new User', function (next) {

		var
			users = {
				saveOAuthUserProfile: function (err, user, isNew, callback) {
					try {
						should.not.exist(err);
						should(user.uri).eql('http://lovelovelove');
						should(isNew).be.True;
					} catch (ex) {
						return callback(ex);
					}
					callback();
				}
			},
			req = {
				user: 'Ted'
			},
			done = function (err) {
				next(err);
			};

		strategy.handler(provider, UserMockup, users)(req, accessTokenValidNew, 'refreshToken', profile, done);
	});

	it('Handles valid token for existing User', function (next) {

		var
			users = {
				saveOAuthUserProfile: function (err, user, isNew, callback) {
					try {
						should.not.exist(err);
						should(user.uri).eql('http://lovelovelove');
						should(isNew).be.False;
					} catch (ex) {
						return callback(ex);
					}
					callback();
				}
			},
			req = {
				user: 'Ted'
			},
			done = function (err) {
				next(err);
			};

		strategy.handler(provider, UserMockup, users)(req, accessTokenValidExists, 'refreshToken', profile, done);
	});
});
