/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').controller('JobsController', [
	'$scope', 'Jobs', '$state', 'growl', 'ApiIntegrations', 'Socket',
	function ($scope, Jobs, $state, growl, ApiIntegrations, Socket) {

		$scope.jobs = Jobs.query();
		//$scope.providers = ApiIntegrations.providers;
		$scope.new = {};
		$scope.label = '';
		$scope.total = 0;
		$scope.progress = 0;

		Socket.on('progress', function (msg) {
			$scope.label = msg.label;
			$scope.total = msg.total;
			$scope.progress = msg.position;
		});

		$scope.getIntegrations = function (val) {
			return ApiIntegrations.query({
				name: val
			}).$promise.then(function (response) {
					return response.items.map(function (item) {
						item.label = '(' + item.provider + ') ' + item.name;
						return item;
					});
				});
		};

		$scope.create = function () {
			(new Jobs($scope.new)).$save(function (object) {
				$state.go('app.jobs.edit', {
					jobId: object._id
				});
			}, function (error) {
				console.log(error);
				growl.error(error);
			});
		};

		$scope.run = function (job) {
			Socket.emit('command', {
				'action': 'job.run',
				'job'   : job._id
			});
		};

	}]);
