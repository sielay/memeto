/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('graph').factory('Type', ['$resource', function ($resource) {

	var Type = $resource('api/graph/type/:typeId', {
		typeId: '@id'
	}, {

		query: {
			method: 'GET',
			isArray: true,
			transformResponse: function (data) {
				var wrapped = angular.fromJson(data);
				angular.forEach(wrapped, function (org, idx) {
					wrapped[idx] = new Type(org);
				});
				return wrapped;
			}
		},
		update: {
			method: 'PUT'
		}
	});
	return Type;

}]);
