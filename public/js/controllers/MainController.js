app.controller('MainController', [ '$scope', '$rootScope', 'bookmarks', 'folders', function ($scope, $rootScope, bookmarks, folders) {
	$rootScope.mainView = true;
	
	//Removing modals registered with previous view
	$('.currviewmodal').remove();

	//Scope variables
	$scope.editing = [];
	$scope.editingFolder = [];
	$scope.moving = [];
	$scope.loadingBookmark = [];
	$scope.loadingFolder = [];
	$scope.bmodal = "bmodal";
	$scope.fmodal = "fmodal";
	
	$rootScope.currentFolderName = null;

	// Getting bookmarks and folders
	bookmarks.get().success(function (data) {
		$scope.bookmarks = data;
	});
	folders.getAll().success(function (data) {
		$scope.folders = data;
	})


	// Helper functions
	function toggleLoading (arr, index) {
		if(typeof arr[index] === 'undefined')
			arr[index] = true;
		else
			arr[index] = !arr[index]
	}

	// Toggle to show/hide the 'move to folder' select element
	$scope.toggleMoving = function (index) {
		if(typeof $scope.moving[index] === 'undefined')
			$scope.moving[index] = true;
		else
			$scope.moving[index] = !$scope.moving[index]
	}

	// Start editing; show edit modal
	$scope.edit = function (index) {
		$scope.editing[index] = angular.copy($scope.bookmarks[index])
		$('.ui.modal.'+$scope.bmodal+index).modal('show');
	}

	// Cancel editing; restore previous values of model
	$scope.cancel = function (index) {
		var restoreObj = $scope.editing[index];
		$scope.bookmarks[index].title = restoreObj.title;
		$scope.bookmarks[index].url = restoreObj.url;
	}

	// Finish editing; Update DB
	$scope.update = function (index) {
		toggleLoading($scope.loadingBookmark, index);
		bookmarks.update($scope.bookmarks[index]).success(function (res) {
			if(!res.error){
				toggleLoading($scope.loadingBookmark, index);
				console.log("update success");
			}
		});
	}

	// Remove bookmark; remove modal tied to it
	$scope.remove = function (index) {
		toggleLoading($scope.loadingBookmark, index);
		bookmarks.delete($scope.bookmarks[index]).success(function (res) {
			if(!res.error){
				$('.'+$scope.bmodal+index).remove();
				toggleLoading($scope.loadingBookmark, index);
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

	// Add bookmark to folder
	$scope.addToFolder = function (index, folder) {
		toggleLoading($scope.loadingBookmark, index);
		var currentBookmark = $scope.bookmarks[index]
		currentBookmark.organized = true;
		bookmarks.update(currentBookmark).success(function (res) {
			if(!res.error){				
				folder.bookmarks.push(currentBookmark);
				folders.update(folder).success(function (res) {
					if(!res.error) {
						toggleLoading($scope.loadingBookmark, index);
						$('.'+$scope.bmodal+index).remove();
						$scope.bookmarks.splice(index, 1);
						$scope.moving[index] = !$scope.moving[index];
						console.log('added to folder successfully')
					}
				})
			}
		})
	}

	// Delete folder
	$scope.removeFolder = function (index) {
		toggleLoading($scope.loadingFolder, index);
		folders.delete($scope.folders[index]).success(function (res) {
			toggleLoading($scope.loadingFolder, index);
			$('.'+$scope.fmodal+index).remove();
			$scope.folders.splice(index, 1);
			console.log('folder deleted successfully')
		})
		.error(function (err) {
			console.error(err);
		})
	}

	// Start editing folder; show edit modal
	$scope.editFolder = function (index) {
		$scope.editingFolder[index] = angular.copy($scope.folders[index])
		$('.ui.modal.fmodal'+index).modal('show');
	}

	// Cancel editing; restore values
	$scope.cancelEditFolder = function (index) {
		var restoreObj = $scope.editingFolder[index];
		$scope.folders[index].name = restoreObj.name;
	}

	$scope.updateFolder = function (folder, index) {
		if(!folder)
			return;
		toggleLoading($scope.loadingFolder, index);
		folders.update(folder).then(function (res) {
			toggleLoading($scope.loadingFolder, index);
			console.log('updated folder successfully');
		})
		.catch(function (err) {
			// Error while updating at server, rolling back model to previous value
			$scope.folders[index].name = $scope.editingFolder[index].name;
			console.error('update folder failed')
			console.error(err);
		})
	}

} ])
