/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('NewEntityModalController', ['$scope', '$modalInstance', 'Type', 'restrict', 'Entity',
	function ($scope, $modalInstance, Type, restrict, Entity) {

		function checkDisabled() {
			var modelScope = $scope.$$childTail;
			return (!modelScope.selected || modelScope.name.replace(/^\s+|\s+$/g).length === 0) && (!modelScope.asset);
		}

		$scope.getTypes = function (val) {
			return Type.query({
				name:     val,
				restrict: restrict || null
			}).$promise.then(function (response) {
					return response.map(function (item) {
						item.name = item.name;
						return item;
					});
				});
		};

		$scope.ok = function () {

			var modelScope = $scope.$$childTail;

			if (checkDisabled()) return;
			/* Stupid: directive force separation of scopes, but doesn't put it as child scope of self, but as next sibling */

			$modalInstance.close({
				metaType: modelScope.selected ? modelScope.selected.meta : null,
				name:     modelScope.name,
				asset:    modelScope.asset
			});
		};

		$scope.getObjects = function (val) {
			return Entity.query({
				name: val,
				meta: restrict || null
			}).$promise.then(function (response) {
					return response.map(function (item) {
						item.name = item.name;
						return item;
					});
				});
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);
