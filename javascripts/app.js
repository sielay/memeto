angular.module('demo', ['ngSanitize'])
	.directive('ngBottom', function () {
		return function (scope, element, attrs) {
			scope.$watchCollection(attrs.ngBottom, function () {
				setTimeout(function () {
					element[0].scrollTop = element[0].scrollHeight + 1000;
				}, 250);
			});
		}
	})
	.factory('Yula', ['$window', '$q', function ($window, $q) {
		return function (messages, scope) {

			var Y = 'Yula',
				G = 'Guest',
				P = 'Paniconymous',
				L = 'Lukasz',
				YT = 'images/hubot.jpg',
				GT = 'images/cookiemonster.jpg',
				PT = 'images/scream.jpg',
				LT = 'images/sielay.png';


			function send(message, timeout, author, thumb) {
				var def = $q.defer();
				setTimeout(function () {
					var msg = new String(''), l = message.length, i = 0;
					messages.push({
						author: author ? author : Y,
						time:   new Date().getTime(),
						thumb:  thumb ? thumb : YT,
						text:   msg
					});

					function tick() {
						msg += message[i];
						messages[messages.length - 1].text = msg;
						scope.$apply();
						if (++i >= l) {
							return def.resolve();
						}
						setTimeout(tick, 10);
					}

					tick();


				}, timeout ? timeout : 1000);
				return def.promise;
			}

			function loop() {

				send('is there an owner of the OurCorp Github org around that I can reach out to?', 1000, G, GT)
					.then(function () {
						return send('yula who manage OurCorp github org?', 1500, L, LT);
					})
					.then(function () {
						return send('I found @mightyadmin, @stronghacker and @moderhator.', 500, Y, YT);
					})
					.then(function () {
						return send('Awesome, thanks', 1000, G, GT);
					})
					.then(function () {
						return send('Who owns the business relationship with VENDOR? thanks!', 3000, P, PT);
					})
					.then(function () {
						return send('yula who has contact to VENDOR', 1000, L, LT);
					})
					.then(function () {
						return send('I found Jenny Smith, her email is jenny.smith@example.com', 500, Y, YT);
					})
					.then(function () {
						return send('@lukasz: can you have your team take a look at brokensite.com?', 3000, G, GT);
					})
					.then(function () {
						return send('yula create card from last 1', 500, L, LT);
					})
					.then(function () {
						return send('I created new trello card on your default board with last 1 message', 500, Y, YT);
					})
					.then(function () {
						return send('yula what has dependency on mongoose?', 3000, L, LT);
					})
					.then(function () {
						return send('I found mememto, awesomeproject and nicedashboard', 500, Y, YT);
					})
					.then(function () {
						return send('yula who is project manager for example.com', 3000, L, LT);
					})
					.then(function () {
						return send('I found @bestlean', 500, Y, YT);
					})
					.then(function () {
						return send('yula get ip for example.com production', 3000, G, GT);
					})
					.then(function () {
						return send('I found 93.184.216.34', 500, Y, YT);
					})
					.then(function () {
						return send('what awesome team does now?', 3000, P, PT);
					})
					.then(function () {
						return send('yula learn "what does {team}" as "get trello card `in play` for trello board `{team}`"', 1000, L, LT);
					})
					.then(function () {
						return send('yula what does awesome', 1000, L, LT);
					})
					.then(function () {
						return send('I found 2 cards', 500, Y, YT);
					})
					.then(function () {
						return send('@marcin make awesome backend', 10, Y, YT);
					})
					.then(function () {
						return send('@tomek make awesome frontend', 10, Y, YT);
					})
					.then(function () {
						setTimeout(function () {
							scope.flush();
							loop();
						}, 5000);
					});
			}

			loop();

		}
	}])
	.controller('Messages', ['$scope', 'Yula', '$sce', '$window', function ($scope, Yula) {

		$scope.messages = [];
		$scope.message = '';
		$scope.disabled = false;

		Yula($scope.messages, $scope);

		$scope.flush = function (disabled) {
			while ($scope.messages.length > 1) {
				$scope.messages.shift();
			}
			$scope.disabled = disabled;
			$scope.$apply();
		};


	}]);

