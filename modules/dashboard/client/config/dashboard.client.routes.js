/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

// Setting up route
angular.module('dashboard').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('app', {
				abstract: true,
				url: '/app',
				templateUrl: 'modules/dashboard/views/app.client.view.html'
			}).state('app.dashboard', {
				url: '/',
				templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
			});
	}
]);
