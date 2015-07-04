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
			resources:   '/api/graph/entity',
			permissions: ['get', 'post']
		}, {
			resources:   '/api/graph/entity/:rid',
			permissions: ['get', 'put', 'delete', 'post']
		}, {
			resources:   '/api/graph/type',
			permissions: ['get', 'post']
		}, {
			resources:   '/api/graph/type/:typeId',
			permissions: ['get', 'put', 'delete']
		}]
	}]);
};

/**
 * Check If Policy Allows
 */
exports.isAllowed = generic.generateIsAllowed(acl);
