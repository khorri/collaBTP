app.controller('fieldVisitCtrl', ['$scope', 'loggedUser', 'project', 'activityService', 'activities', '$filter', 'ngDialog', 'notificationService', '$window', function ($scope, loggedUser, project, activityService, activities, $filter, ngDialog, notificationService, $window) {

	$scope.project = project.data;
	$scope.activities = [];
    $scope.isGeneratingFV = false;
    $scope.fvGenIndex = null;
    $scope.toAttachedFiles =[];
    $scope.isChangingState = false;

	$scope.refreshData = function () {
		activityService.getAllByProject($scope.project.id, function () {
			$scope.activities = activityService.activities
		});
	}

	$scope.activities = activities.data;

	$scope.newActivity = {};
	$scope.currentActivity = {};
	$scope.newActivity.date = new Date();
	$scope.activityDate = $filter('date')($scope.newActivity.date, "dd/MM/yyyy");
	$scope.currentActivityDate = {};
	$scope.newActivity.status = "Nouveau";

	$scope.createActivity = function () {
		activityService.add({
			title: $scope.newActivity.title,
			status: $scope.newActivity.status,
			description: $scope.newActivity.description,
			date: $scope.newActivity.date,
			project: $scope.project.id,
			contributor: $scope.newActivity.contributor
		}, function (data) {
			notificationService.notify({
				title: 'Nouvelle visite ajoutée',
				text: 'La visite "' + data.ref + '" a été ajoutée',
				icon: 'fa fa-plus',
				type: 'success',
				animate_speed: 'fast',
			});
			$scope.refreshData();
			$scope.newActivity = {};
			$scope.activityDate = $filter('date')(new Date(), "dd/MM/yyyy");
		})
	}
	$scope.updateActivity = function () {
		activityService.update($scope.currentActivity, function () {
			$scope.currentActivityDate = $filter('date')(new Date(), "dd/MM/yyyy");
			$scope.refreshData();
			notificationService.notify({
				title: 'Visite modifiée',
				text: 'La visite "' + $scope.currentActivity.ref + '" a été modifiée',
				icon: 'fa fa-edit',
				type: 'success',
				animate_speed: 'fast',
			});
			$scope.currentActivity = {};
		});
	}

	$scope.openAddActivityModal = function () {
		ngDialog.open({
			template: 'addActivityModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: true,
			className: 'ngdialog-theme-default ngdialog-big'
		});
	}
	$scope.openUpdateActivityModal = function (activityID) {
		activityService.getById(activityID, function (activity) {
			$scope.currentActivity = activity;
			$scope.currentActivityDate = $filter('date')($scope.currentActivity.date, "dd/MM/yyyy");
		});
		ngDialog.open({
			template: 'updateActivityModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: true,
			className: 'ngdialog-theme-default ngdialog-big'
		});
	}

	$scope.openDeleteActivityModal = function (activity) {
		$scope.currentActivity = activity;
		ngDialog.open({
			template: 'deleteActivityModal',
			scope: $scope,
			showClose: true,
			closeByDocument: false,
			closeByEscape: true,
			className: 'ngdialog-theme-default ngdialog-small'
		});
	}

	$scope.activityDateChosen = function () {
		$scope.activityDate = $filter('date')($scope.newActivity.date, "dd/MM/yyyy");
		$scope.currentActivityDate = $filter('date')($scope.currentActivity.date, "dd/MM/yyyy");
	}

	$scope.deleteActivity = function (activity) {
		activityService.remove(activity.id, function () {
			notificationService.notify({
				title: 'Visite supprimée',
				text: 'La visite "' + activity.ref + '" a été supprimée',
				icon: 'fa fa-trash',
				type: 'danger',
				animate_speed: 'fast',
			});
			$scope.refreshData();
		});
		$scope.currentActivity = {};
	}

	$scope.closeModal = function () {
		ngDialog.closeAll();
	}

	$scope.generateFVDoc = function (activity, index) {
        $scope.isGeneratingFV = true;
        $scope.fvGenIndex = index;
		activityService.generateFVDoc({
			projectName: $scope.project.name,
			projectAddress: $scope.project.address,
			projectRef: $scope.project.ref,
			projectLeader: $scope.project.projectLeader.name,
			participants: $scope.project.participants,
			activityId: activity.id,
			activityRef: activity.ref,
			description: activity.description,
			activityDate: activity.date,
			contributor: activity.contributor.name,
			title: activity.title

		}, function (result) {
			$window.open(result.webPath);
            $scope.isGeneratingFV = false;
            $scope.fvGenIndex = null;
		});
	}

    $scope.isGeneratingFVDoc = function (index) {
        if ($scope.fvGenIndex == index) {
            return true;
        } else {
            return false

        }
    }

}]);