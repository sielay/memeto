/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state',
	function($scope, Authentication, $state) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		if(Authentication.user) {
			$state.go('app.dashboard');
		}
	}
]);
