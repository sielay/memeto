/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

angular.module('sources').directive('jobRunner', ['$window', function () {
	return {
		restrict: 'E',
		replace: 'true',
		scope: {
		},
		link: function (scope, elem) {

		},
		controller: function ($scope, Socket) {
			return;/*
			// Create a messages array
			$scope.status = '';

			// Add an event listener to the 'chatMessage' event
			Socket.on('status', function(message) {
				$scope.status = message;
			});

			// Remove the event listener when the controller instance is destroyed
			$scope.$on('$destroy', function() {
				Socket.removeListener('message');
			});*/

		},
		template: '<div data-ng-bind="status"></div>'
	};
}]);



// Create the 'chat' controller
angular.module('sources').controller('ChatController', ['$scope',/* 'Socket',*/
	function($scope/*, Socket*/) {


	}
]);
