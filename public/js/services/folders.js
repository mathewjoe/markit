app.factory('folders', [ '$http', function ($http) {
	var folders = {
		getAll : function () {
			return $http.get('/folders/');
		},
		get : function (_id) {
			return $http.get('/folders/'+_id);
		},
		new : function (newObj) {
			return $http.post('/folders/',newObj);
		},
		update : function (modObj) {
			var _id = modObj._id;
			delete modObj._id;
			return $http.put('/folders/'+_id, modObj);
		},
		delete : function (modObj) {
			return $http.delete('/folders/'+modObj._id);
		}

	}

	return folders;
}])