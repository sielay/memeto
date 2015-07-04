/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('graph').controller('EntityController', ['$scope', '$location', 'Entity', '$stateParams',
	function ($scope, $location, Entity, $stateParams) {

		$scope.entity = Entity.get({
			rid: $stateParams.rid
		});

	}]);
