app.factory('bookmarks', [ '$http', function ($http) {
	
	var bookmarks = {
		getAll : function () {
			return $http.get('/bookmarks/');
		},
		get : function (_id) {
			return $http.get('/bookmarks/'+_id);
		},
		new : function (newObj) {
			return $http.post('/bookmarks/',newObj);
		},
		update : function (modObj) {
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