/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var _               = require('lodash'),
	mongoose        = require('mongoose'),
	mongoosecompare = require('mongoosecompare'),
	config          = require('../../../../../config/config'),
	User            = mongoose.model('User');


exports.userByID = function (req, res, next, id) {

	var isTest = (config.isTest && req.headers.loggedin);

	if(!req.user && !isTest) return res.error('Unauthorised', 403); // security breach in params

	if (!mongoosecompare.valid(id)) {
		return res.error('Invalid user ID', 400);
	}

	function handle(err, user) {
		/* istanbul ignore next */
		if (err) return res.error('Invalid user ID - 2', 400);
		/* istanbul ignore next */
		if (!user) return res.error('Invalid user ID - 3', 400);
		req.profile = user;
		next();
	}

	if (config.isTest) {
		return handle(null, (new User()));
	}
	/* istanbul ignore next */
	User.findById(id).exec(handle);
};
