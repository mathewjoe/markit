app.factory('bookmarks', [ '$http', function ($http) {
	
	var bookmarks = {
		getAll : function () {
			return $http.get('/bookmarks/all');
		},
		get : function (_id) {
			return $http.get('/bookmarks/');
		},
		new : function (newObj) {
			return $http.post('/bookmarks/',newObj);
		},
		update : function (modBookmark) {
			var modObj = angular.copy(modBookmark);
			var _id = modObj._id;
			delete modObj._id;
			return $http.put('/bookmarks/'+_id, modObj);
		},
		delete : function (modObj) {
			return $http.delete('/bookmarks/'+modObj._id);
		}

	}

	return bookmarks;
}])