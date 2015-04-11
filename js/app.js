var app = angular.module('app', ['ngRoute']).config(function($routeProvider){
	$routeProvider.when('/groups', {
		templateUrl: 'groups.html',
		controller: 'LoginController'
	});
	$routeProvider.when('/home', {
		templateUrl: 'home.html',
		controller: 'HomeController'
	});
	$routeProvider.otherwise({redirectTo:'login'});
});

app.controller('LoginController', function($location,$scope){ 
 $scope.login   = function(){
 	if($scope.input.login ==='admin')
		$location.path('home')
 }
});
app.controller('HomeController', function($location,$scope){
	$scope.loginout   = function(){
 	
		$location.path('login')
	}
 
});