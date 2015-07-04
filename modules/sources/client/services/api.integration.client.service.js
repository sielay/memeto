/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

angular.module('sources').factory('ApiIntegrations', ['$resource',
	function ($resource) {

		var ApiIntegrations = $resource('api/integration/:integrationId', {
			integrationId: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: false,
				transformResponse: function (data) {
					var wrapped = angular.fromJson(data);
					angular.forEach(wrapped.items, function (org, idx) {
						wrapped.items[idx] = new ApiIntegrations(org);
					});
					return wrapped;
				}
			},
			update: {
				method: 'PUT'
			},
			test: {
				method: 'GET',
				url : '/api/integration/:integrationId/test',
				transformResponse: function (data) {
					return angular.fromJson(data);
				}
			},
			providers: {
				method: 'GET',
				url : '/api/integration/providers',
				isArray: false
			}

		});
		return ApiIntegrations;
	}
]);
