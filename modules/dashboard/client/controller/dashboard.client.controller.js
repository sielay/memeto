/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$state', 'Authentication',
	function($scope, $state, Authentication) {
		// Expose view variables
		if(!Authentication.user) {
			$state.go('authentication.signin');
		}
	}
]);
