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
		
		this.msg = "Competency message";
		
		this.comps = $dataService.getData();
		
		this.onLinkClick = function(event, somedata) {
			event.preventDefault();
			$timeout(function() {
				$location.path("/somepath/" + somedata.id);
			}, 10);
		};
		
	});
	
	app.controller('SubCtrl', function($scope, $routeParams, $rootScope, $location, $timeout, $dataService) {
	
		var compId = $routeParams.someId;
		var comp = $dataService.getData(someId);
	});

	
		
})();
