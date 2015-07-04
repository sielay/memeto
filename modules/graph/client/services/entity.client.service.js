/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('graph').factory('Entity', ['$resource', '$http', '$q',
	function ($resource, $http, $q) {

		var Entity = $resource('api/graph/entity/:rid', {
			rid: '@id'
		}, {

			query:  {
				method:            'GET',
				isArray:           true,
				transformResponse: function (data) {
					var wrapped = angular.fromJson(data);
					angular.forEach(wrapped, function (org, idx) {
						wrapped[idx] = new Entity(org);
					});
					return wrapped;
				}
			},
			update: {
				method: 'PUT'
			}
		});

		/**
		 *
		 * @param from
		 * @param to
		 * @returns {Q.Promise}
		 */
		Entity.link = function (from, to) {
			var uri = '/api/graph/entity/' + from.replace(/^#/, ''),
				deferred = $q.defer();

			$http.post(uri, {
				target: to.replace(/^#/, '')
			}).success(function (data) {
				deferred.resolve(data);
			}).error(function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		return Entity;

	}]);
