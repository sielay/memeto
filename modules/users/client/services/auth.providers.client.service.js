/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('users').factory('AuthProviders', ['$resource',
	function ($resource) {
		return $resource('api/auth', {}, {
			get : {
				isArray: true
			}
		});
	}
]);
