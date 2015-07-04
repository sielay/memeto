/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').factory('Jobs', ['$resource',
	function ($resource) {

		var Jobs = $resource('api/job/:jobId', {
			jobId: '@_id'
		}, {
			query: {
				method: 'GET',
				isArray: false,
				transformResponse: function (data) {
					var wrapped = angular.fromJson(data);
					angular.forEach(wrapped.items, function (org, idx) {
						wrapped.items[idx] = new Jobs(org);
					});
					return wrapped;
				}
			},
			update: {
				method: 'PUT'
			}
		});


		return Jobs;
	}
]);
