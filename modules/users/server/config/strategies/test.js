/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';
var //passportStrategy = require('passport-strategy'),
	passport = require('passport'),
	util     = require('util'),
	mongoose = require('mongoose'),
	User     = mongoose.model('User'),
	users    = require('../../controllers/users/users.authentication.server.controller'),
	config   = require('../../../../../config/config');


function Strategy(verify) {
	passport.Strategy.call(this);
	this.name = 'test';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
	if (config.isTest) {

		var that = this, profileExp = {
			firstName:               'Ted',
			lastName:                'the Bear',
			displayName:             'Ted the Bear',
			email:                   'ted@bazinga.com',
			username:                'theted',
			profileImageURL:         'scarletjohannson.png',
			provider:                'test',
			providerIdentifierField: 'id',
			providerData:            {
				id:         '123456',
				avatar_url: 'scarletjohannson.png',
				url:        'http://lovelovelove'
			},
			uri:                     'http://lovelovelove'
		};

		return User.oAuthHandle(
			req.user,
			'test',
			profileExp.providerData.id,
			'testToken',
			'testRefreshToken',
			profileExp.providerData,
			profileExp,
			function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, function () {
					if (err) {
						/* istanbul ignore next */
						return that.fail({});
					}
					that.success(user, {});
				});
			});
	}
	/* istanbul ignore next */
	this.fail({});
};


/**
 * Expose `Strategy`.
 */
module.exports = function () {
	if (config.isTest) {
		// Use local strategy
		passport.use(new Strategy());
	}
};
