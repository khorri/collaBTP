app.controller('missionsCtrl', ['$scope', '$window', 'loggedUser', 'project', 'subProjects', 'allMissions', 'projectService', 'customerService', 'ngDialog', 'notificationService', 'subProjectService', '$upload', '$state', function ($scope, $window, loggedUser, project, subProjects, allMissions, projectService, customerService, ngDialog, notificationService, subProjectService, $upload, $state) {

	$scope.project = project.data;
	$scope.subprojects = subProjects.data;
	$scope.allMissions = allMissions;
	$scope.isGenerating = false;
	$scope.isCreatingSubproject = false;
	$scope.isUpdatingSubproject = false;
	$scope.genIndex = null;
	$scope.newsubproject = {};
	$scope.newsubproject.paymentmethods = [{
		percentage: 0,
		label: ''
 }];
	$scope.remainingMissions = function () {
		var missionAlreadyChosen = [];
		var remainingMissions = [];
		var missionAlreadyChosenId = [];

		angular.forEach($scope.subprojects, function (item) {
			missionAlreadyChosen.push.apply(missionAlreadyChosen, item.missions)
		});
		angular.forEach(missionAlreadyChosen, function (item) {
			missionAlreadyChosenId.push(item.id)
		});
		angular.forEach($scope.allMissions, function (item) {
			if (missionAlreadyChosenId.indexOf(item.id) < 0) {
				remainingMissions.push(item)
			}
		});
		return remainingMissions;
	}

	$scope.allMissionsToEdit = $scope.remainingMissions();

	$scope.removeFromMission = function ($item, $model) {
		$scope.allMissionsToEdit.push($item);
	}

	$scope.addToMission = function ($item, $model) {
		$scope.allMissionsToEdit.splice($scope.allMissionsToEdit.indexOf($item), 1);
	}

	$scope.openAddMissionDialog = function () {
		ngDialog.open({
			template: 'addMissionModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: true,
			className: 'ngdialog-theme-default ngdialog-big',
            preCloseCallback: function(value) {
                _reset();
                return true;
            }
		});
	}
    var _reset = function(){
        $scope.newsubproject = {};
        $scope.newsubproject.paymentmethods = [{
            percentage: 0,
            label: ''
        }];
    }

	$scope.openDeleteSubProjectDialog = function (subproject) {
		$scope.subproToDel = subproject;
		ngDialog.open({
			template: 'deleteSubProjectModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: true,
			className: 'ngdialog-theme-default ngdialog-small'
		});
	}

	$scope.closeModal = function () {
		ngDialog.closeAll();
	}

	$scope.addPm = function () {
		$scope.newsubproject.paymentmethods.push({
			percentage: 0,
			label: ''
		});
	}

	$scope.currentCustomer = {};
	customerService.getById($scope.project.customer.id, function (data) {
		$scope.currentCustomer = data;
	});

	$scope.generateContract = function (subproject, index) {
		$scope.isGenerating = true;
		$scope.genIndex = index;
		var missionGO = false;
		var missionPELEC = false;
		var missionETANCH = false;
		var goOrPLMB = false;
		angular.forEach(subproject.missions, function (mission, index) {
			if (mission.name == "Gros Oeuvres") {
				missionGO = true; //GROS OEUVRE
			}
			if (mission.name == "Plomberie et Electricité") {
				missionPELEC = true; //Plomberie et Electricité
			}
			if (mission.name == "Etanchéité") {
				missionETANCH = true; //ETANCHEITE DES TERRASSES
			}
		});
		if (missionGO || missionPELEC) {
			goOrPLMB = true;
		}
        var duration = ($scope.project.ends)?moment($scope.project.ends).diff(moment($scope.project.starts),'months'):undefined;
		projectService.generatePdf({
			subProjectId: subproject.id,
			subProjectDate: moment(subproject.createdAt).format("DD/MM/YYYY"),
			ourCompany: 'Risk Control',
			ourCompanyAddress: 'hay El Oulfa, GH4B, résidence Arreda n°25 appt. n°3 Quartier: Oulfa CASABLANCA',
			projectRef: $scope.project.ref,
			projectName: $scope.project.name,
			projectLeader: $scope.project.projectLeader.name,
			projectAddress: $scope.project.address,
			customer: $scope.currentCustomer.company,
			customerType: $scope.currentCustomer.type.name,
			customerAddress: $scope.currentCustomer.address,
			missionGO: missionGO,
			missionPELEC: missionPELEC,
			missionETANCH: missionETANCH,
			goOrPLMB: goOrPLMB,
			budget: subproject.budget,
			city: $scope.project.city,
			paymentMethods: subproject.paymentMethods,
            projectDuration: duration
		}, function (file) {
			notificationService.notify({
				title: 'Contrat généré',
				text: 'Contrat généré avec succès',
				icon: 'fa fa-file-pdf-o',
				type: 'success',
				animate_speed: 'fast',
			});
			$window.open(file.webPath);
			$scope.isGenerating = false;
			$scope.genIndex = null;
		})
	}

	$scope.removePm = function (index) {
		$scope.newsubproject.paymentmethods.splice(index, 1);
	}

	$scope.budgetPercentage = function (index) {
		var num = 0.01 * $scope.newsubproject.paymentmethods[index].percentage * $scope.newsubproject.budget;
		return Math.round(num * 100) / 100;
	}

	$scope.addPmWhenUp = function () {
		$scope.subProjectToUpdate.paymentMethods.push({
			percentage: 0,
			label: ''
		});
	}

	$scope.removePmWhenUp = function (index) {
		$scope.subProjectToUpdate.paymentMethods.splice(index, 1);
	}

	$scope.budgetPercentageWhenUp = function (index) {
		var num = 0.01 * $scope.subProjectToUpdate.paymentMethods[index].percentage * $scope.subProjectToUpdate.budget;
		return Math.round(num * 100) / 100;
	}

	$scope.nextBarType = function (index) {
		if (index == 0) {
			return "success";
		} else if (index % 2 == 0)
			return "success";
		else
			return "default";
	}

	$scope.addMissions = function () {
		$scope.isCreatingSubproject = true;
		projectService.addSubproject({
			id: $scope.project.id,
			missions: $scope.newsubproject.missions,
			budget: $scope.newsubproject.budget,
			paymentMethods: $scope.newsubproject.paymentmethods
		}, function (data) {
			notificationService.notify({
				title: 'Mission(s) ajoutée(s)',
				text: 'Nouvelle(s) mission(s) ajoutée(s) au projet avec succès',
				icon: 'fa fa-plus',
				type: 'success',
				animate_speed: 'fast',
			});
			$scope.isCreatingSubproject = false;
			$scope.subprojects.push(data);
			$scope.closeModal();
			$scope.newsubproject = {};
			$scope.newsubproject.paymentmethods = [{
				percentage: 0,
				label: ''
   }];
		})
	}

	$scope.isDeletingSubproject = false;

	$scope.deleteSubProject = function () {
		$scope.isDeletingSubproject = true;
		subProjectService.remove($scope.subproToDel.id, function () {
			var index = $scope.subprojects.indexOf($scope.subproToDel);
			$scope.subprojects.splice(index, 1);
			$scope.closeModal();
			$scope.isDeletingSubproject = false;
		});
	}

	$scope.isContratGenerating = function (index) {
		if ($scope.genIndex == index) {
			return true;
		} else {
			return false

		}
	}
	$scope.openUploadContractDialog = function (subProject) {
		$scope.subProjectToUpload = subProject;
		ngDialog.open({
			template: 'uploadContractModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: false,
			className: 'ngdialog-theme-default ngdialog-big'
		});
	}

	$scope.$watch('files', function () {
		if ($scope.files != null) {
			$scope.upload($scope.files[0]);
		}
	});

	$scope.upload = function (file) {
		if (file) {
			$upload.upload({
				url: '/file/uploadSignedContract',
				fileFormDataName: 'doc',
				file: file,
				fields: {
					id: $scope.subProjectToUpload.id
				}
			}).progress(function (evt) {
				$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function (data, status, headers, config) {
				$scope.subprojects[$scope.subprojects.indexOf($scope.subProjectToUpload)].signedContract = data;
				$scope.subProjectToUpload = {};
				$scope.files = [];
				$scope.closeModal();
			});
		}
	};

	$scope.showSubProject = function (subProject) {
		$scope.currentSubProject = subProject;
		$scope.subProjectSelected = true;
	}

	$scope.cancel = function () {
		$scope.currentSubProject = {};
		$scope.subProjectSelected = false;
	}

	$scope.openUpdateSubProjectDialog = function (subProject) {
		$scope.allMissionsToEdit = $scope.remainingMissions();
		$scope.subProjectToUpdate = angular.copy(subProject);
		ngDialog.open({
			template: 'updateMissionModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: false,
			className: 'ngdialog-theme-default ngdialog-big'
		});
	}

	$scope.updateSubProject = function () {
		$scope.isUpdatingSubproject = true;
		subProjectService.update($scope.subProjectToUpdate, function (data) {
			notificationService.notify({
				title: 'Mission(s) modifiée(s)',
				text: 'Mission(s) modifiée(s) avec succès',
				icon: 'fa fa-edit',
				type: 'success',
				animate_speed: 'fast',
			});
			$scope.refreshData();
			$scope.isUpdatingSubproject = false;
			$scope.closeModal();
		})
	}

	$scope.max = 0;

	$scope.checkTotal = function (paymentmethods) {
		var total = 0;
		for (var i = 0; i < paymentmethods.length; i++) {
			var val = paymentmethods[i].percentage;
			total += val;
		}
		$scope.total = total;
	}

	$scope.$watch('total', function () {
		$scope.max = 100 - $scope.total;

		if ($scope.max < 0)
			$scope.max = -1;
	});

	$scope.refreshData = function () {
		subProjectService.getByProject($scope.project.id, function (data) {
			$scope.subprojects = data;
		})
	}

}]);