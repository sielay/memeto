/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var path           = require('path'),
	errorHandler   = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mongoose       = require('mongoose'),
	ApiIntegration = mongoose.model('ApiIntegration'),
	passport       = require('passport'),
	config         = require('../../../../../config/config'),
	User           = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function (req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Abao is stupid
	Object.keys(req.headers).forEach(function (key) {
		if (key.match(/^user_/)) {
			req.body[key.replace(/^user_/, '').replace(/(_\w{1})/g, function (v) {
				return v.toUpperCase()[1];
			})] = req.headers[key];
		}
	});

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					/* istanbul ignore next */
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {

	// Abao is stupid
	Object.keys(req.headers).forEach(function (key) {
		if (key.match(/^user_/)) {
			/* istanbul ignore next */
			req.body[key.replace(/^user_/, '').replace(/(_\w{1})/g, function (v) {
				return v.toUpperCase()[1];
			})] = req.headers[key];
		}
	});

	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
				if (err) {
					/* istanbul ignore next */
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (req, res, next) {
	var responser = passport.authenticate(req.oauthProvider.name, function (err, user, redirectURL) {
		if (err || !user) {
			/* istanbul ignore next */
			return res.redirect('/#!/signin');
		}
		req.login(user, function (err) {
			if (err) {
				/* istanbul ignore next */
				return res.redirect('/#!/signin');
			}

			return res.redirect(redirectURL || '/');
		});

	});
	responser(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile WTF is that?
 */
exports.saveOAuthUserProfile = function (err, user, isNew, done) {
	if (err) {
		/* istanbul ignore next */
		return done(err);
	}
	if (!user) {
		/* istanbul ignore next */
		return done(new Error('No user returned by Strategy'));
	}
	if (isNew) {
		return done(null, user);
	}
	/* istanbul ignore next */
	done(null, user, '/#!/settings/accounts');
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res) {
	var user = req.user;
	var provider = req.param('provider');
	var id = req.param('id');

	// testing ABAO
	if (config.isTest && config.autologin === true && req.headers.loggedin) {
		user = {
			id: '123',
			removeIdentity : function(){},
			markModified: function(){},
			save: function(callback) {
				callback(null, req.user);
			}
		};
	}

	if (user && provider && id) {

		user.removeIdentity(provider, id);
		user.markModified('identities');

		user.save(function (err) {
			if (err) {
				/* istanbul ignore next */
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						/* istanbul ignore next */
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).json('Invalid parameters');
	}
};

exports.oauthAccept = function (req, res) {
	switch (req.oauthProvider.provider) {
		case 'facebook':
		{
			/* istanbul ignore next */
			return passport.authenticate('facebook', {
				scope: ['email']
			})(req, res);
		}
		case 'twitter':
		{
			/* istanbul ignore next */
			return passport.authenticate('twiter')(req, res);
		}
		case 'google':
		{
			/* istanbul ignore next */
			return passport.authenticate('google', {
				scope: [
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email'
				]
			})(req, res);
		}
		case 'linkedin':
		{
			/* istanbul ignore next */
			return passport.authenticate('linkedin', {
				scope: [
					'r_basicprofile',
					'r_emailaddress'
				]
			})(req, res);
		}
		case 'github':
		{
			/* istanbul ignore next */
			return passport.authenticate(req.oauthProvider.name)(req, res);
		}
		case 'slack':
		{
			/* istanbul ignore next */
			return passport.authenticate(req.oauthProvider.name)(req, res);
		}
		case 'trello':
		{
			/* istanbul ignore next */
			return passport.authenticate(req.oauthProvider.name)(req, res);
		}
		case 'test':
		{
			return res.redirect('/api/auth/test/callback');
		}

	}
	/* istanbul ignore next */
	res.status('400').json('Unsupported provider - 1');
};


exports.oauthProviderByName = function (req, res, next, id) {
	ApiIntegration.findOne({
		name:        id,
		allowOAuth2: true
	}, function (err, provider) {
		/* istanbul ignore next */
		if (err) return res.error(err);
		if (id === 'test' && config.isTest) {
			req.oauthProvider = {
				name: 'test',
				provider: 'test'
			};
		} else {
			if (!provider) return res.status('400').json('Unsupported provider - 2');
			/* istanbul ignore next */
			req.oauthProvider = provider;
		}
		next();
	});
};


/**
 * Gets list of available strategies
 * @param req
 * @param res
 */
exports.availableProviders = function (req, res) {
	var strategies = [];
	Object.keys(passport._strategies).forEach(function (strategy) {
		if (['session', 'local'].indexOf(strategy) === -1) {
			strategies.push({
				name:     strategy,
				provider: passport._strategies[strategy].name || null
			});
		}
	});
	res.api(strategies);
};
