app.controller('MainController', [ '$scope', 'bookmarks', 'folders', function ($scope, bookmarks, folders) {
	bookmarks.getAll().success(function (data) {
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
} ])