/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').controller('ApiIntegrationsContoller', ['$scope', 'ApiIntegrations', '$state', 'growl', function ($scope, ApiIntegrations, $state, growl) {

	$scope.apiIntegrations = ApiIntegrations.query();
	$scope.providers = ApiIntegrations.providers();
	$scope.new = {};

	$scope.create = function () {
		(new ApiIntegrations($scope.new)).$save(function (object) {
			$state.go('app.sources.edit', {
				integrationId: object._id
			});
		}, function (error) {
			console.log(error);
			growl.error(error);
		});
	};

}]);
