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
	
	app.run(function($rootScope, $location) {
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			// event.preventDefault();
			if (current) {
				console.log(current.controller + " --> " + next.controller);
			} else {
				console.log(next.controller);
			}
		});
		$rootScope.$on('$routeChangeSuccess', function(event, next, current) {
			console.log("$routeChangeSuccess: " + event);
		});
		$rootScope.$on('$locationChangeStart', function(event, toState) {
			console.log("$locationChangeStart: " + event);
		});
		

		
		
	});
	
	app.service('$dataService', function() {
		this.getData = function() {
			if (!this.data) {
				this.dataMap = {};
				var rawData = [];
				angular.forEach(rawData, function(comp, key) {
				});
			}
			return this.data;
		};
		this.getSomeData = function(someId) {
			this.getData();
			return this.dataMap[someId];
		};
	});
	
	app.controller('RootCtrl', function($rootScope, $timeout, $location) {
		$scope = $rootScope;
		$scope.initialized = false;
		
		this.onResetClick = function(event) {
			event.preventDefault();
			$timeout(function() {
				$location.path("/somepath");
			}, 10);
		};
		
		$timeout(function() {
			$scope.initialized = true;
		}, 200);
	});
	
	app.controller('MainCtrl', function($rootScope, $scope, $location, $timeout, $dataService) {
		
		$scope.stateConfig = stateConfig; //$dataService.getData();
		angular.forEach($scope.stateConfig, function(value, key) {
			value['key'] = key;
		});
		$scope.currState = stateConfig['newYork'];
		
		$scope.onCloseModal = function() {
			$scope.showModal = false;
		};
		
		$scope.drawState = function(state) {
			var attributes = {
				'fill' : '#b9204b',
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
		
		$scope.onStateSelect = function() {
			$scope.drawState($scope.currState);
			//FIXME: get from service
			$scope.institutions = stateData[$scope.currState.key]['institutions'];
			$scope.showModal = true;
		};
		
		$scope.onStateClick = function(state) {
			$scope.currState = state;
			$scope.drawState(state);
			$scope.institutions = stateData[state.key]['institutions'];
			$scope.showModal = true;
		};

		$scope.$watch('currState', function(newValue, oldValue) {
			console.log('currState watcher. newValue: ' + newValue);
		});
		
		$scope.$on('stateClick', function(e, data) {
			console.log("onStateClick. data: " + data);
			e.preventDefault();
			$scope.currState = $scope.stateConfig[data];
			$scope.onStateSelect();
		});
		
		$scope.institutions = stateData[$scope.currState.key]['institutions'];
		$scope.drawState($scope.currState);
		
		setTimeout(function() {
			createMap($scope);
		}, 100);

		
	});
	
	app.controller('SubCtrl', function($scope, $routeParams, $rootScope, $location, $timeout, $dataService) {
	
		var compId = $routeParams.someId;
		var comp = $dataService.getData(someId);
	});

	
		
})();
