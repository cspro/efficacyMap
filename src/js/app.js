(function() {
	var app = angular.module('efficacyMapApp', ['ngRoute']);
	
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/main.tpl.html',
				controller: 'MainCtrl',
				reloadOnSearch: false
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
	
	app.service('$dataService', function() {
		this.getStateData = function(id) {
			if (!this.stateData) {
				this.stateData = data.stateData;
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
				angular.forEach(this.stateConfig, function(value, key) {
					var stateObj = stateData[key];
					value['key'] = key;
					value['enabled'] = (stateObj && stateObj['items']) ? true : false;
					if (stateObj && stateObj['items']) {
						value['count'] = stateObj['items'].length;
					} else {
						value['count'] = 0;
					}
				});
			}
			if (id && this.stateConfig[id]) {
				return this.stateConfig[id];
			} else {
				return this.stateConfig;
			}
		};
		this.getStateIds = function() {
			if (!this.stateIds) {
				var stateIds = [];
				if (!this.stateConfig) {this.getStateConfig();}
				angular.forEach(this.stateConfig, function(value, key) {
					stateIds.push(value['key']);
				});
				this.stateIds = stateIds;
			}
			return this.stateIds;
		};
	});
	
	app.directive('escKey', function($document) {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				$document.bind('keydown keypress', function(e) {
					if (e.which === 27) {
						scope.$apply(function() {
							scope.$eval(attrs.escKey);
						});
						e.preventDefault();
					}
				});
			}
		};
	}); 
	
	app.controller('MainCtrl', function($rootScope, $scope, $location, $timeout, $window, $routeParams, $dataService) {
		
		$scope.stateConfig = $dataService.getStateConfig();
		$scope.stateConfigArray = []; // for select box
		angular.forEach($scope.stateConfig, function(value, key) {
			$scope.stateConfigArray.push(value);
		});
		
		$scope.$on('$routeUpdate', function(value) {
			console.log("on $routeUpdate. value: " + value);
		});
		
		console.log("$routeParams: " + $routeParams.stateId);
		var stateIds = $dataService.getStateIds();
		var stateId = $routeParams.stateId ? $routeParams.stateId.toUpperCase() : null;
		if (stateId && stateIds.indexOf(stateId) > -1 ) {
			$scope.currState = $dataService.getStateConfig(stateId);
		}

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
		$scope.onStateClick = function(e, state) {
			e.preventDefault();
			$scope.currState = state;
			$scope.$apply();
		};

		$scope.$watch('currState', function(state) {
			if (state) {
			  $('#wrapper').animate({scrollTop: 0 });
			  $('#partnerList').animate({scrollTop: 0});
				$scope.drawState(state);
				$scope.items = $dataService.getStateData(state.key)['items'];
				$scope.showModal = true;
				$location.search({stateId: state.key});
			} else {
				$location.search('');
			}
		});
		
		$scope.showPlacement = false;
		$scope.xOffset = $scope.yOffset = 0; 
		$scope.scale = 1;
		$scope.onTransformChange = function() {
			$scope.transform = "t" + $scope.xOffset + "," + $scope.yOffset + "s" + $scope.scale;
			$scope.rState.clear();
			var attributes = {
				'fill' : '#364395',
				'stroke-width' : 1,
				'stroke' : '#ffffff',
				'font-family' : 'Verdana',
				'font-size' : '19px',
				'font-weight' : 'bold'
			};
			var path = $scope.currState.path;
			var shape = $scope.rState.path(path).attr(attributes);
			shape.transform($scope.transform);
		};
		
		// Call external map script, pass in scope for callback
		setTimeout(function() {
			createMap($scope, $dataService.getStateConfig());
		}, 10);

	});
	
})();
