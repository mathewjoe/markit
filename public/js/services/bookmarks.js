app.factory('bookmarks', [ '$http', function ($http) {
	return $http.get('/bookmarks/');
}])