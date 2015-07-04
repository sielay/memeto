/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.users = function (req, res) {
	User.find({}, function (error, users) {
		res.json(users || null);
	});
};

exports.read = function (req, res) {
	res.api(req.profile);
};
