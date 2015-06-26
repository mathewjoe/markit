app.controller('FolderController', ['$scope', '$routeParams', 'bookmarks', 'folders', function ($scope, $routeParams, bookmarks, folders) {
	
	// Using services : Retrieving current folder and other folders from DB
	folders.get($routeParams.id).success(function (res) {
		if(!res.error){
			$scope.folder = res;
		}
	})
	folders.getAll().success(function (res) {
		if(!res.error){
			$scope.folders = res.filter(function (folder) {
				if(folder._id == $routeParams.id)
					return false;
				return true;
			})
		}
	})

	// Scope Variables
	$scope.editing = []

	// Scope methods
	$scope.edit = function (index) {
		$scope.editing[index] = angular.copy($scope.folder.bookmarks[index])
	}
	$scope.cancel = function (index) {
		$scope.folder.bookmarks[index] = angular.copy($scope.editing[index]);
		$scope.editing[index] = false;
	}
	$scope.update = function (index) {
		// bookmarks.update($scope.folder.bookmarks[index]).success(function (res) {
		// 	if(!res.error){
		// 		$scope.editing[index] = false;
		// 		console.log("update success");
		// 	}
		// });
		//Update folder, then update bookmark collection
		folders.update($scope.folder)
		.then(function (res) {
			$scope.editing[index] = false;
			console.log('update folder success');
			return bookmarks.update($scope.folder.bookmarks[index])
		})
		.then(function (res) {
			console.log('update bookmark success');
		})
		.catch(function (err) {
			console.error(err)
		})
	}
	$scope.remove = function (index) {
		$scope.folder.bookmarks.splice(index, 1);
		folders.update($scope.folder).success(function (res) {
			console.log('bookmark removed successfully');
		})
	}
	$scope.moveToFolder = function (index, folder) {
			var currentBookmark = $scope.folder.bookmarks[index]
			$scope.folder.bookmarks.splice(index, 1);
			folder.bookmarks.push(currentBookmark);
			//Update current folder, then update the folder bookmark was added to
			folders.update($scope.folder).then(function (res) {
				return folders.update(folder);
			})
			.then(function (res) {
				console.log('moved to folder successfully');
			})
			.catch(function (err) {
				console.log(err);
			})
		}
	$scope.removeFromFolder = function (index) {
		var currentBookmark = angular.copy($scope.folder.bookmarks[index]);
		currentBookmark.organized = false;
		//Update bookmarks collection (set organized:false) , then update folder (remove from bookmarks[] of folder)
		bookmarks.update(currentBookmark).then(function (res) {
			var folder = angular.copy($scope.folder);
			folder.bookmarks.splice(index, 1);
			return folders.update(folder)
		})
		.then(function (res) {
			$scope.folder.bookmarks.splice(index, 1);
			console.log("removed from folder successfully");
		})
		.catch(function (err) {
			console.error(err);
		})
	}
}])