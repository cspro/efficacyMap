(function() {
	var app = angular.module('efficacyMapApp', ['ngRoute']);
	
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.tpl.html',
				controller: 'MainCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
	
	app.service('$dataService', function() {
		this.getStateData = function(id) {
			if (!this.stateData) {
				this.stateData = data.stateData;
				angular.forEach(this.stateData, function(value, key) {
				});
			}
			if (id && this.stateData[id]) {
				return this.stateData[id];
			} else {
				return this.stateData;
			}
		};
		this.getStateConfig = function(id) {
			if (!this.stateConfig) {
				this.stateConfig = data.stateConfig;
				var stateData = data.stateData;
				var stateConfigArray = [];
				angular.forEach(this.stateConfig, function(value, key) {
					var stateObj = stateData[key];
					value['key'] = key;
					value['enabled'] = (stateObj && stateObj['institutions']) ? true : false;
					if (stateObj && stateObj['institutions']) {
						value['count'] = stateObj['institutions'].length;
					} else {
						value['count'] = 0;
					}
					stateConfigArray.push(value);
				});
				this.stateConfigArray = stateConfigArray;
			}
			if (id && this.stateConfig[id]) {
				return this.stateConfig[id];
			} else {
				return this.stateConfig;
			}
		};
	});
	
	app.controller('MainCtrl', function($rootScope, $scope, $location, $timeout, $dataService) {
		
		$scope.stateConfig = $dataService.getStateConfig();
		$scope.stateConfigArray = [];
		angular.forEach($scope.stateConfig, function(value, key) {
			$scope.stateConfigArray.push(value);
		});

		$scope.onCloseModal = function() {
			$scope.showModal = false;
			$scope.currState = null;
		};
		
		$scope.drawState = function(state) {
			var attributes = {
				'fill' : '#364395',
				'stroke-width' : 1,
				'stroke' : '#ffffff',
				'font-family' : 'Verdana',
				'font-size' : '19px',
				'font-weight' : 'bold'
			};
			if ($scope.rState) {
				$scope.rState.clear();
			} else {
				$scope.rState = new Raphael('stateMap', 300, 300);
			}
			var path = state.path;
			var shape = $scope.rState.path(path).attr(attributes);
			if (state.transform) {
				shape.transform(state.transform);
			}
			shape.glow({'width': 15, 'opacity': 0.5, 'fill': true});
		};

		// callback for external map script
		$scope.onStateClick = function(state) {
			$scope.currState = state;
		};

		$scope.$watch('currState', function(state) {
			if (state) {
				$scope.drawState(state);
				$scope.institutions = $dataService.getStateData(state.key)['institutions'];
				$scope.showModal = true;
			}
		});
		
		// Call external map script, pass in scope for callback
		setTimeout(function() {
			createMap($scope, $dataService.getStateConfig());
		}, 100);

	});
	
})();
