// HOME CONTROLLER

app.controller('homeCtrl', ['$scope', '$compile', 'navService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$resource', 'projectService', 'notificationService', 'allProject', '$upload', '$timeout', 'subProjectService', 'numberToWordsService','moment', function ($scope, $compile, navService, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $resource, projectService, notificationService, allProject, $upload, $timeout, subProjectService, numberToWordsService,moment) {

    $scope.projects = allProject;
    $scope.displayedCollection = [].concat($scope.projects);
    $scope.project = {};
    $scope.model = {};
    $scope.projectToDel = {};
    $scope.indexMissionsShowing = null;

    $scope.closeModal = function () {
        ngDialog.closeAll();
    };


    $scope.createProject = function () {
        projectService.add($scope.project, function () {
            $scope.refreshData();
            notificationService.notify({
                title: 'Projet ajouté',
                text: 'Le projet "' + $scope.project.name + '" a été ajouté',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
        });
        $scope.closeModal();
    }

    //Supression de Projet

    $scope.openDeleteDialog = function (project) {
        $scope.projectToDel = project;
        ngDialog.open({
            template: 'delProjectModal',
            scope: $scope,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }

    $scope.deleteProject = function () {
        projectService.remove($scope.projectToDel, function () {
            $scope.projects.splice($scope.projects.indexOf($scope.projectToDel), 1);
            $scope.closeModal();
            notificationService.notify({
                title: 'Projet supprimé',
                text: 'Le projet "' + $scope.projectToDel.name + '" a été supprimé',
                icon: 'fa fa-trash',
                type: 'success',
                animate_speed: 'fast',
            });
        })

    }


    //actualisation des donnés du tableau

    $scope.refreshData = function () {
        projectService.getAll(function () {
            $scope.projects = projectService.projects;
        });

    }

    // Uploader un contract

    $scope.openUploadContractDialog = function (project) {
        $scope.projectToUpload = project;
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

    $scope.missionDetails = function (project, $index) {
        $scope.key = $index;
        $scope.projectSelected = project;
        subProjectService.getByProject(project.id, function (data) {
            $scope.subProjects = data;
            ngDialog.open({
                template: 'missionDetailModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
            $scope.indexMissionsShowing = null;
        });
    }

    $scope.upload = function (file) {
        if (file) {
            $upload.upload({
                url: '/file/uploadSignedContract',
                fileFormDataName: 'doc',
                file: file,
                fields: {
                    projectId: $scope.projectToUpload.id
                }
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.projects[$scope.projects.indexOf($scope.projectToUpload)].status = 'Contract signed'
                $scope.projectToUpload = {};
                $scope.files = [];
                $scope.closeModal();
            });
        }
    };

    $scope.calculateTotalBudget = function (missions) {
        var total = 0;
        angular.forEach(missions, function (item, index) {
            total += item.budget;
        });
        return total;
    }

    $scope.isShowingMissions = function (index) {
        if ($scope.indexMissionsShowing == index)
            return true;
        else return false;

    };

    $scope.getDuration = function(o){
        var start = moment(o.starts);
        var end = (o.ends)?moment(o.ends):o.ends;
        var diffByDays =  moment().diff(start,'days');
        var duration = (o.ends)? end.diff(start,'days') : 20;
        var elapsedTimePercent = (diffByDays/parseFloat(duration))*100;
        var rest = 100-elapsedTimePercent;
        return elapsedTimePercent+','+rest;
    };

}]);