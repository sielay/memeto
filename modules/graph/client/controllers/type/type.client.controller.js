/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('TypeController', ['$scope', '$location', 'Type', '$stateParams',
	function ($scope, $location, Type, $stateParams) {

		$scope.type = Type.get({
			typeId: $stateParams.typeId
		});

	}]);
