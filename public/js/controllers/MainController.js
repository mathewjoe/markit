app.controller('MainController', [ '$scope', 'bookmarks', 'folders', function ($scope, bookmarks, folders) {
	bookmarks.success(function (data) {
		$scope.bookmarks = data;
		console.log(data)
	});
	folders.success(function (data) {
		$scope.folders = data;
		console.log(data)

	})
} ])