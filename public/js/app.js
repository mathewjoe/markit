var app = angular.module('MarkIt', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller : 'MainController',
		templateUrl : 'views/MainView.html'
	})
	.when('/folder/:id',{
		controller : 'FolderController',
		templateUrl : 'views/FolderView.html'
	})
	.otherwise({
		redirectTo : '/'
	})
})
