/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('TypesController', ['$scope', '$location', 'Type',
	function ($scope, $location, Type) {

		$scope.types = Type.query();

	}]);
