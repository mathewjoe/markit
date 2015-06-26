app.controller('MainController', [ '$scope', 'bookmarks', 'folders', function ($scope, bookmarks, folders) {
	bookmarks.get().success(function (data) {
		$scope.bookmarks = data;
	});
	folders.getAll().success(function (data) {
		$scope.folders = data;
	})
	$scope.editing = [];
	$scope.edit = function (index) {
		$scope.editing[index] = angular.copy($scope.bookmarks[index])
	}
	$scope.cancel = function (index) {
		$scope.bookmarks[index] = $scope.editing[index];
		$scope.editing[index] = false;
	}
	$scope.update = function (index) {
		bookmarks.update($scope.bookmarks[index]).success(function (res) {
			if(!res.error){
				$scope.editing[index] = false;
				console.log("update success");
			}
		});
	}
	$scope.remove = function (index) {
		bookmarks.delete($scope.bookmarks[index]).success(function (res) {
			if(!res.error){
				$scope.bookmarks.splice(index, 1);
				console.log("deleted successfully");
			}
		})
	}
	$scope.save = function (bookmark) {
		bookmarks.new(bookmark).success(function (res) {
			if(!res.error && res._id){
				$scope.bookmarks.push(res);
				console.log("new bookmark added")
				$scope.newBookmark = {}
			}
		});
	}
	$scope.saveFolder = function (folder) {
		folders.new(folder).success(function (res) {
			if(!res.error && res._id){
				$scope.folders.push(res);
				console.log("new folder added")
				$scope.newFolder = {}
			}
		})
		.error(function(err) {
			if(err.message == "folder exists") {
				alert('Sorry, the given folder name already exists')
			}
		})
	}
	$scope.addToFolder = function (index, folder) {
		console.log($scope.bookmarks[index]);
		console.log(folder)
		var currentBookmark = $scope.bookmarks[index]
		currentBookmark.organized = true;
		bookmarks.update(currentBookmark).success(function (res) {
			if(!res.error){
				$scope.bookmarks.splice(index, 1);
				folder.bookmarks.push(currentBookmark);
				folders.update(folder).success(function (res) {
					if(!res.error) {
						console.log('added to folder successfully')
					}
				})
			}
		})
	}

	$scope.removeFolder = function (index) {
		folders.delete($scope.folders[index]).success(function (res) {
			$scope.folders.splice(index, 1);
		})
		.error(function (err) {
			console.error(err);
		})
	}
} ])