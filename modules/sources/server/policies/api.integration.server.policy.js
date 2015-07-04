/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';


var acl     = require('acl'),
	generic = require('../../../core/server/policies/generic.server.policy');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Users Permissions
 */
exports.invokeRolesPolicies = function () {
	acl.allow([{
		roles:  ['admin', 'user', 'test'],
		allows: [{
			resources:   '/api/integration',
			permissions: ['get', 'post']
		}, {
			resources:   '/api/integration/:integrationId',
			permissions: ['get', 'put', 'delete']
		},{
			resources:   '/api/integration/providers',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If Policy Allows
 */
exports.isAllowed = generic.generateIsAllowed(acl);
