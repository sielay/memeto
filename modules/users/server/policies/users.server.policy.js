/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
generic = require('../../../core/server/policies/generic.server.policy');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Users Permissions
 */
exports.invokeRolesPolicies = function () {
	acl.allow([{
		roles:  ['admin', 'test'],
		allows: [{
			resources:   '/api/users',
			permissions: ['get']
		}, {
			resources:   '/api/users/:userId',
			permissions: ['get']
		}]
	},{
		roles:  ['admin', 'test', 'user'],
		allows: [{
			resources:   '/api/users/me',
			permissions: ['get']
		},{
			resources:   '/api/users/password',
			permissions: ['post']
		},{
			resources:   '/api/users/accounts',
			permissions: ['delete']
		},{
			resources:   '/api/users/picture',
			permissions: ['post']
		}]
	}]);
};

/**
 * Check If Policy Allows
 */
exports.isAllowed = generic.generateIsAllowed(acl);
