app.controller('planCtrl', ['$scope', 'project', 'planService', 'plans', 'ngDialog', 'notificationService', '$upload', 'subProjectService','$state', function ($scope, project, planService, plans, ngDialog, notificationService, $upload, subProjectService,$state) {
    'use strict';
    //getPlansOfProject
    $scope.displayedCollection = [].concat(plans.data);
    $scope.plans = plans.data;
    $scope.project = project.data;
    $scope.contributors = $scope.project.contributors;
    $scope.plan = {
        project: $scope.project
    };
    $scope.plan.starts = moment();
    $scope.plan.ends = moment($scope.plan.starts).add(1, 'days');
    $scope.planStarts = moment($scope.plan.starts).format("DD/MM/YYYY");
    $scope.planEnds = moment($scope.plan.ends).format("DD/MM/YYYY");
    $scope.isCreating = false;
    $scope.documents = [];
    $scope.newDocument = {};
    (function () {
        console.log($scope.project.subProjects[0]);
        var subProject = $scope.project.subProjects[0];
        return subProjectService.getById(subProject.id, function (data) {
            $scope.missions = data.missions;
        })
    }());


    $scope.refreshData = function () {
        planService.getByProject($scope.project, function (plans) {
            $scope.plans = plans;
            $scope.displayedCollection = [].concat($scope.plans);
        });
    };

    $scope.startsTimeChosen = function () {
        $scope.plan.ends = moment($scope.plan.starts).add(1, 'days');
        $scope.planStarts = moment($scope.plan.starts).format("DD/MM/YYYY");
        $scope.planEnds = moment($scope.plan.ends).format("DD/MM/YYYY");
    }
    $scope.endsTimeChosen = function () {
        $scope.planEnds = moment($scope.plan.ends).format("DD/MM/YYYY");
    }

    //Add new plan
    $scope.createPlan = function () {
        $scope.isCreating = true;
        planService.create({plan: $scope.plan, attachedFiles: $scope.documents}, function () {
            notificationService.notify({
                title: 'Plan créé',
                text: 'Le plan "' + $scope.plan.name + '" a été crée',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast',
            });
            $scope.isCreating = false;
            $state.go('project.plans',{id:$scope.project.id});
        })
        $scope.isCreating = false;
    }
    //update a plan
    //Delete plan
    $scope.openDeleteDialog = function (p) {
        $scope.selectedPlan = p;
        ngDialog.open({
            template: 'deletePlanDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    };
    $scope.deletePlan = function (p) {
        planService.remove(p.id, function () {
            notificationService.notify({
                title: 'Plan supprimé',
                text: 'Le plan <b>' + p.name + '</b> a été supprimé avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.selectedPlan = {};
            $scope.refreshData();
        });
    }
    $scope.closeModal = function () {
        //$scope.user = {};
        ngDialog.closeAll();
    }
    //Create and upload necessary documents.
    $scope.addDocument = function () {
        $scope.documents.push($scope.newDocument);
        $scope.newDocument = {};
    }
    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.documents, function (item) {
            item.selected = $scope.selectedAll;
        });

    };
    $scope.openDeleteDocModal = function (document) {
        $scope.currentDocument = document;
        ngDialog.open({
            template: 'DeleteDocModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }
    $scope.deleteDocument = function (doc) {

        var i = $scope.documents.indexOf(doc);
        //if is already uploaded then delete it from the server
        $scope.documents.splice(i, 1);
    }

    $scope.openUploadModal = function (document) {
        $scope.fileName = document;
        ngDialog.open({
            template: 'uploadDocDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
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
                url: '/file/uploadPlanDoc',
                fileFormDataName: 'doc',
                file: file,
                fields: {
                    projectId: $scope.project.id,
                    fileName: $scope.fileName.name
                }
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                console.log(data);
                var i = $scope.documents.indexOf($scope.fileName);
                data.isUploaded = true;
                $scope.documents[i] = data;
                $scope.files = [];
                delete $scope.fileName;
                $scope.closeModal();
            });
        }
    };

    //upload a plan or add new version

}]);