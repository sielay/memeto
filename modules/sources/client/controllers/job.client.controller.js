/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').controller('JobController', [
	'$scope', 'Jobs', '$state', '$stateParams', 'growl', 'ApiIntegrations', 'Authentication',
	function ($scope, Jobs, $state, $stateParams, growl, ApiIntegrations, Authentication) {

		$scope.changed = false;

		var watcher;

		$scope.reload = function () {
			if (watcher) {
				watcher();
			}

			$scope.item = Jobs.get({
				jobId: $stateParams.jobId
			}, function (item) {
				$scope.item = item;

				$scope.providerTypes = ApiIntegrations.providerTypes({
					provider : $scope.item.integration.provider
				});

				watcher = $scope.$watch('item', function (newValue, oldValue) {
					if (!angular.equals(newValue, oldValue)) {
						$scope.changed = true;
					}
				}, true);
				$scope.changed = false;
			});
		};

		$scope.save = function () {
			$scope.item.$update(function () {
				$scope.changed = false;
			}, function (errorResponse) {
				growl.error(errorResponse.message);
			});
		};

		$scope.useMyToken = function () {
			$scope.item.token = Authentication.user.getToken($scope.item.integration.name);
		};

		$scope.reload();


	}]);
