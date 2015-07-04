/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

// Setting up route
angular.module('sources').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('app.sources', {
				url: '/app/sources',
				data: {
					label: 'Sources'
				},
				abstract: true,
				template: '<ui-view></ui-view>'
			}).
			state('app.sources.list', {
				url: '/',
				data: {
					label: 'Sources'
				},
				templateUrl: 'modules/sources/views/list.client.view.html'
			}).
			state('app.sources.edit', {
				url: '/:integrationId',
				data: {
					label: 'Sources'
				},
				templateUrl: 'modules/sources/views/edit.client.view.html'
			}).
			state('app.jobs', {
				url: '/app/jobs',
				data: {
					label: 'Jobs'
				},
				abstract: true,
				template: '<ui-view></ui-view>'
			}).
			state('app.jobs.list', {
				url: '/',
				data: {
					label: 'Jobs'
				},
				templateUrl: 'modules/sources/views/jobs/list.client.view.html'
			}).
			state('app.jobs.edit', {
				url: '/:jobId',
				data: {
					label: 'Jobs'
				},
				templateUrl: 'modules/sources/views/jobs/edit.client.view.html'
			});
	}
]);
