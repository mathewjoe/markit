app.controller('FolderController', ['$scope', '$rootScope', '$routeParams', 'bookmarks', 'folders', function ($scope, $rootScope, $routeParams, bookmarks, folders) {
	
	// Using services : Retrieving current folder and other folders from DB
	folders.get($routeParams.id).success(function (res) {
		if(!res.error){
			$scope.folder = res;
			initializations();
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
	$scope.moving = [];
	$rootScope.mainView = false;

	function initializations () {
	$scope.bmodal = "bmodal"+$scope.folder._id;
	$scope.fmodal = "fmodal"+$scope.folder._id;	
	}

	// Scope methods
	$scope.toggleMoving = function (index) {
		if(typeof $scope.moving[index] === 'undefined')
			$scope.moving[index] = true;
		else
			$scope.moving[index] = !$scope.moving[index]
	}
	$scope.edit = function (index) {
		$scope.editing[index] = angular.copy($scope.folder.bookmarks[index]);
		$('.ui.modal.'+$scope.bmodal+index).modal('show');
	}
	$scope.cancel = function (index) {
		var restoreObj = $scope.editing[index];
		$scope.folder.bookmarks[index].title = restoreObj.title;
		$scope.folder.bookmarks[index].url = restoreObj.url;
		// $scope.editing[index] = false;
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
		var folder = angular.copy($scope.folder);
		var bookmark = folder.bookmarks.splice(index, 1)[0];
		folders.update(folder).then(function (res) {
			return bookmarks.delete(bookmark)
		})
		.then(function (res) {
			$scope.folder.bookmarks.splice(index, 1);
			console.log('bookmark removed successfully');
		})
		.catch(function (err) {
			console.error(err);
		})
	}
	$scope.moveToFolder = function (index, folder) {
			var currentBookmark = $scope.folder.bookmarks[index]
			var currFolder = angular.copy($scope.folder);
			currFolder.bookmarks.splice(index, 1);
			folder.bookmarks.push(currentBookmark);
			//Update current folder, then update the folder bookmark was added to
			folders.update(currFolder).then(function (res) {
				$scope.folder.bookmarks.splice(index,1);
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