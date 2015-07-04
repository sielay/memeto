/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var acl    = require('acl'),
	config = require('../../../../config/config'),
	mongoose = require('mongoose');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Core Permissions
 */
exports.invokeRolesPolicies = function () {
};

/**
 * Create policy checker
 */
exports.generateIsAllowed = function (acl) {
	return function (req, res, next) {

		var roles = (req.user) ? req.user.roles : ['guest'];

		if (config.autologin === true && !!req.headers.loggedin) {
			roles = ['test'].concat(roles);
		}

		// Check for user roles
		acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
			if (err) {
				// it's acl problem
				/* istanbul ignore next */
				// An authorization error occurred.
				return res.status(500).send('Unexpected authorization error');
			} else {
				if (isAllowed) {
					// Access granted! Invoke next middleware
					return next();
				} else {
					return res.status(403).json({
						message: 'User is not authorized'
					});
				}
			}
		});
	};
};

exports.isAllowed = exports.generateIsAllowed(acl);
