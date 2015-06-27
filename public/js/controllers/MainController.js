app.controller('MainController', [ '$scope', '$rootScope', 'bookmarks', 'folders', function ($scope, $rootScope, bookmarks, folders) {
	
	$('.modals').remove();

	bookmarks.get().success(function (data) {
		$scope.bookmarks = data;
	});
	folders.getAll().success(function (data) {
		$scope.folders = data;
	})
	$scope.editing = [];
	$scope.editingFolder = [];
	$scope.moving = [];
	$scope.bmodal = "bmodal";
	$scope.fmodal = "fmodal";
	$rootScope.mainView = true;
	$rootScope.currentFolderName = false;

	$scope.toggleMoving = function (index) {
		if(typeof $scope.moving[index] === 'undefined')
			$scope.moving[index] = true;
		else
			$scope.moving[index] = !$scope.moving[index]
	}
	$scope.edit = function (index) {
		$scope.editing[index] = angular.copy($scope.bookmarks[index])
		$('.ui.modal.'+$scope.bmodal+index).modal('show');
	}
	$scope.cancel = function (index) {
		var restoreObj = $scope.editing[index];
		$scope.bookmarks[index].title = restoreObj.title;
		$scope.bookmarks[index].url = restoreObj.url;
	}
	$scope.update = function (index) {
		bookmarks.update($scope.bookmarks[index]).success(function (res) {
			if(!res.error){
				// $scope.editing[index] = false;
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

	//Adding new bookmarks
	$rootScope.addNew = function (type) {
		$('.new'+type).modal('show');
	}

	$rootScope.save = function (bookmark) {
		//Saving new bookmarks
		if(!bookmark)
			return;
		bookmarks.new(bookmark).success(function (res) {
			if(!res.error && res._id){
				$scope.bookmarks.push(res);
				console.log("new bookmark added")
				$rootScope.newBookmark = {}
			}
		});
	}
	$rootScope.saveFolder = function (folder) {
		//Saving new folder
		if(!folder)
			return;
		folders.new(folder).success(function (res) {
			if(!res.error && res._id){
				$scope.folders.push(res);
				console.log("new folder added")
				$rootScope.newFolder = {}
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
						$scope.moving[index] = !$scope.moving[index];
						console.log('added to folder successfully')
					}
				})
			}
		})
	}

	$scope.removeFolder = function (index) {
		folders.delete($scope.folders[index]).success(function (res) {
			$scope.folders.splice(index, 1);
			console.log('folder deleted successfully')
		})
		.error(function (err) {
			console.error(err);
		})
	}

	$scope.editFolder = function (index) {
		$scope.editingFolder[index] = angular.copy($scope.folders[index])
		$('.ui.modal.fmodal'+index).modal('show');
	}

	$scope.cancelEditFolder = function (index) {
		var restoreObj = $scope.editingFolder[index];
		$scope.folders[index].name = restoreObj.name;
	}

	$scope.updateFolder = function (folder) {
		if(!folder)
			return;
		folders.update(folder).then(function (res) {
			console.log('updated folder successfully');
		})
		.catch(function (err) {
			// Error while updating at server, rolling back model to previous value
			$scope.folders[index].name = $scope.editingFolder[index].name;
			console.error('update folder failed')
			console.error(err);
		})
	}

	$scope.$on('$viewContentLoaded', function () {
		//callTimeout();
	})
} ])

//To be removed
function callTimeout() {
	setTimeout(function () {
		console.log("timed out")
		$('.ui.dimmable').dimmer({
			on : 'hover'
		})
	}, 500);
}