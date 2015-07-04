/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('users').controller('ExternalAuthenticationController', ['$scope', 'AuthProviders',
	function($scope, AuthProviders) {
		$scope.integrations = AuthProviders.get();
	}
]);
