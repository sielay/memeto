/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').controller('ApiIntegrationController', ['$scope', 'ApiIntegrations', '$state', '$stateParams', 'growl', function($scope, ApiIntegrations, $state, $stateParams, growl) {

	$scope.providers = ApiIntegrations.providers;
	$scope.changed = false;

	var watcher;

	$scope.reload = function() {
		if(watcher) {
			watcher();
		}

		$scope.item = ApiIntegrations.get({
			integrationId : $stateParams.integrationId
		}, function(item){
			$scope.item = item;
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

	$scope.test = function() {
		ApiIntegrations.test({
			integrationId : $scope.item._id
		},function (data) {
			if(data) {
				growl.success('It works!');
			} else {
				growl.error('Oh kwak!');
			}
		}, function (errorResponse) {
			growl.error(errorResponse.message);
		});
	};

	$scope.reload();



}]);
