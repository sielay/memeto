/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('EntitiesController', ['$scope', '$location', 'Entity',
	function ($scope, $location, Entity) {

		$scope.entities = Entity.query();

	}]);
