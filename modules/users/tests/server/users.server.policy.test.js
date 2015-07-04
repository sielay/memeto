/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var policy = require('../../server/policies/users.server.policy'),
	should = require('should');

describe('User policies', function () {

	it('isAllowed 403', function (next) {

		policy.isAllowed({
			route:  {
				path: '/api/users'
			},
			headers : {},
			method: 'get'
		}, {
			status: function (status) {
				should(status).eql(403);
				return {
					json: function () {
						next();
					}
				};
			}
		}, function () {
		});

	});

	it('isAllowed OK', function (next) {

		policy.invokeRolesPolicies();

		policy.isAllowed({
			user:   {
				roles: ['admin']
			},
			headers : {},
			route:  {
				path: '/api/users'
			},
			method: 'get'
		}, {
			status: function (status) {
				next(new Error(status));
			}
		}, function () {
			next();
		});

	});

});
