/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('GraphExplorerController', ['$scope', '$location', 'Entity', 'growl',
	function ($scope, $location, Entity, growl) {

		$scope.graph = $location.hash() || 'world';

		$scope.onSelected = function (item) {
			if(!item) return;
			$scope.graph = item.id;
		};

		$scope.link = function (from, to, callback) {
			Entity.link(from, to).then(function() {
				callback(from);
			}, function(err) {
				growl.error(err);
			});
		};

		/**
		 *
		 * @param data
		 * @param data.asset
		 * @param data.metaType
		 * @param data.name
		 * @param callback
		 * @returns {*}
		 */
		$scope.onNewNode = function (data, callback) {
			if (data.asset) {
				return $scope.link(data.asset.id, $scope.graph, function () {
					callback(data.asset.id);
				});
			}
			(new Entity({
				name: data.name,
				meta: data.metaType
			})).$save(function (instance) {
					$scope.link(instance.id, $scope.graph, function () {
						callback(instance);
					});
				}, function (err) {
					console.error(err);
					growl.error(err);
				});
		};

	}]);
