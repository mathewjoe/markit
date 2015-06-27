var app = angular.module('MarkIt', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider.when('/', {
		controller : 'MainController',
		templateUrl : 'views/mainviewsem.html'
	})
	.when('/folder/:id',{
		controller : 'FolderController',
		templateUrl : 'views/folderviewsem.html'
	})
	.otherwise({
		redirectTo : '/'
	})
})