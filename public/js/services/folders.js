app.factory('folders', [ '$http', function ($http) {
	return $http.get('/folders/');
}])