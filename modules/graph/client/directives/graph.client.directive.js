/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 *
 */
angular.module('graph').directive('graph', [
	'$window', 'Entity', '$location', '$modal',
	function ($window, Entity, $location, $modal) {

		return {
			restrict:   'E',
			replace:    'true',
			scope:      {
				model:         '=model',
				id:            '=resourceId',
				onSelected:    '=onSelected',
				onClick:       '=onClick',
				onDoubleClick: '=onDoubleClick',
				onNew:         '=onNew',
				restrictMetas: '=restrictMetas',
				layout:        '=layout',
				depth:         '=depth'
			},
			link:       function (scope, elem) {
				scope.canvas = elem[0];

			},
			controller: function ($scope) {

				function picker() {
					var modalInstance = $modal.open({
						templateUrl: '/modules/graph/views/modals/new.entity.module.client.view.html',
						controller:  'NewEntityModalController',
						resolve:     {
							restrict: function () {
								return $scope.restrictMetas;
							}
						}
					});
					return modalInstance.result;
				}

				$scope.relations = {};

				$scope.exists = function (id) {
					var exists = false;
					angular.forEach($scope.data.nodes, function (node) {
						if (node.id === id) {
							exists = true;
						}
					});
					return exists;
				};


				$scope.load = function (uid) {
					Entity.get({
						rid:   uid,
						depth: $scope.depth ? $scope.depth : 1,
						metas: $scope.restrictMetas
					}, function (data) {
						$location.hash(uid);
						$scope.addItem(data, 999);
						if ($scope.onSelected) {
							$scope.onSelected(data.uri);
						}
						$scope.update();
					}, function () {
						$scope.update();
					});
				};


				$scope.reset = function () {
					$scope.data = {


						nodes: [], edges: []
					};
				};

				$scope.reset();
				$scope.load($scope.model);

				$scope.$watch('model', function (currentValue, oldValue) {
					if (currentValue !== oldValue) {
						$scope.load(currentValue);
					}
				});


				$scope.update = function () {

					var options = {
						layout:       {
							randomSeed: undefined
						},
						interaction:  {
							navigationButtons: true,
							keyboard:          true
						},
						width:        '100%',
						height:       '500px',
						edges:        {
							font:   {
								align: 'middle',
								size:  10
							},
							smooth: false,
							color:  '#aaa'
						},
						nodes:        {
							shape: 'icon',
							font:  {
								size:        11,
								strokeWidth: 3,
								strokeColor: 'white'
							},
							icon:  {
								face: 'FontAwesome',
								size: 25
							}
						},
						manipulation: {
							initiallyActive: false,
							addNode:         $scope.onNew ? function (data, callback) {
								picker().then(function (result) {
									$scope.onNew(result, function(instance){
										$scope.reset();
										$scope.load(instance.id ? instance.id : instance);
									});
								}, function (err) {
									console.error(err);
								});
							} : false

						}
					};

					if ($scope.layout === 'hierarchical') {
						options.layout.hierarchical = {
							enabled:         true,
							levelSeparation: 120,
							direction:       $scope.direction ? $scope.direction : 'UD',   // UD, DU, LR, RL
							sortMethod:      'directed' // hubsize, directed
						};
					}

					$scope.vis = new $window.vis.Network($scope.canvas, $scope.data, options);

					$scope.vis.on('select', function (properties) {
						if (properties) {
							if ($scope.onSelected) {
								if (properties.nodes && properties.nodes[0]) {
									angular.forEach($scope.data.nodes, function (item) {
										if (item.id === properties.nodes[0] && item.id) {
											$scope.onSelected(item);//uri
										}
									});

								}
							}
						}
					});

					$scope.vis.on('click', function (properties) {
						if (properties) {
							if ($scope.onClick) {
								$scope.onClick(properties);
							}
						}
					});

					$scope.vis.on('doubleClick', function (properties) {
						if (properties) {
							if (properties.nodes && properties.nodes[0]) {
								$scope.reset();
								$scope.load(properties.nodes[0]);
							}
							if ($scope.onDoubleClick) {
								$scope.onDoubleClick(properties);
							}
						}
					});
				};

				$scope.decorate = function (item, level) {
					var data = {
						id:    item.id,
						label: item.name,
						icon:  {
							color: $scope.data.nodes.length === 0 ? '#000' : '#666',
							code:  item.type.icon ? $window.fontIconConvert.classToUnicode(item.type.icon) : null
						},
						shape: item.thumb ? 'circularImage' : (item.type.icon ? 'icon' : 'box'),
						uri:   item.uri,
						level: level
					};

					if (item.thumb) {
						data.image = item.thumb;
					}

					return data;
				};

				$scope.addItem = function (item, level) {

					var exists = false;

					angular.forEach($scope.data.nodes, function(node) {
						if(node.id === item.id) exists = true;
					});

					if(!exists) {
						var data = $scope.decorate(item, level);
						$scope.data.nodes.push(data);
					}

					if (item.nodes && item.nodes.length > 0) {

						angular.forEach(item.nodes, function (node) {

							if (typeof node === 'string') return;

							$scope.addItem(node, level + 1);

							$scope.data.edges.push({
								from:  item.id,
								to:    node.id,
								label: node.role
							});
						});
					}
					if (item.parents && item.parents.length > 0) {

						angular.forEach(item.parents, function (node) {
							if (typeof node === 'string') return;

							$scope.addItem(node, level - 1);
							$scope.data.edges.push({
								to:    item.id,
								label: node.role,
								from:  node.id
							});
						});
					}
				};


			},
			template:   '<div class="network-graph"></div>'
		};
	}]);

