/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

// Setting up route
angular.module('graph').config(['$stateProvider',
	function ($stateProvider) {
		// Users state routing
		$stateProvider.
			state('app.graph', {
				abstract: true,
				url:      '/app/graph',
				template: '<ui-view></ui-view>'
			}).state('app.graph.explorer', {
				url:         '/',
				templateUrl: 'modules/graph/views/explorer.client.view.html'
			}).state('app.type', {
				abstract: true,
				url:      '/app/type',
				template: '<ui-view></ui-view>'
			}).state('app.type.list', {
				url:         '/',
				templateUrl: 'modules/graph/views/type/list.client.view.html'
			}).state('app.type.one', {
				url:         '/:typeId',
				templateUrl: 'modules/graph/views/type/one.client.view.html'
			}).state('app.entity', {
				abstract: true,
				url:      '/app/entity',
				template: '<ui-view></ui-view>'
			}).state('app.entity.list', {
				url:         '/',
				templateUrl: 'modules/graph/views/entity/list.client.view.html'
			}).state('app.entity.one', {
				url:         '/:rid',
				templateUrl: 'modules/graph/views/entity/one.client.view.html'
			});
	}
]);
