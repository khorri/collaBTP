// PROFIL CONTROLLER

app.controller('uploadCtrl', ['$scope', 'navService', '$sails', '$upload', '$timeout', function ($scope, navService, $sails, $upload, $timeout) {

	$scope.$watch('files', function () {
		if ($scope.files != null) {
			for (var i = 0; i < $scope.files.length; i++) {
				$scope.errorMsg = null;
				(function (file) {
					generateThumbAndUpload(file);
				})($scope.files[i]);
			}
		}
	});

	function generateThumbAndUpload(file) {
		$scope.errorMsg = null;
		$scope.generateThumb(file);
		$scope.upload(file);
	}

	$scope.generateThumb = function (file) {
		if (file != null) {
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
				$timeout(function () {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = function (e) {
						$timeout(function () {
							file.dataUrl = e.target.result;
						});
					}
				});
			}
		}
	}

	$scope.upload = function (file) {
		$upload.upload({
			url: '/file/upload',
			fileFormDataName: 'docs',
			file: file
		}).progress(function (evt) {
			$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		}).success(function (data, status, headers, config) {
			console.log(data);
		});
	};


}]);