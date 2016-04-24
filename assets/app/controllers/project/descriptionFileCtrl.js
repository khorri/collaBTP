app.controller('descriptionFileCtrl', ['$scope', '$filter', 'loggedUser', 'project', 'descriptionFileService', 'allParticipants', 'notificationService', function ($scope, $filter, loggedUser, project, descriptionFileService, allParticipants, notificationService) {

    $scope.loggedUser = loggedUser.data;
    $scope.project = project.data;
    $scope.newDescFile = {};
    $scope.newDescFile.version = 0;
    $scope.allParticipants = allParticipants;
    $scope.allVersions = [];
    $scope.descFileVersions = $scope.project.descriptionFiles.length;


    descriptionFileService.getAllByProject($scope.project.id, function (data) {
        $scope.allVersions = data;
    });

    //get the latest descriptionFile version

    if ($scope.descFileVersions > 0) {
        descriptionFileService.getLastVersion($scope.project.id, function (data) {
            $scope.newDescFile = data;
            $scope.newDescFile.date = $filter('date')(data.date, 'yyyy-MM-dd');
        });
    }

    $scope.createDescriptionFile = function () {
        descriptionFileService.add({
            name: $scope.project.name,
            version: $scope.newDescFile.version + 1,
            participants: $scope.newDescFile.participants,
            project: $scope.project.id,
            createdBy: $scope.loggedUser.id,
            riskEvaluation: $scope.newDescFile.riskEvaluation,
            observations: $scope.newDescFile.observations,
            workExamination: $scope.newDescFile.workExamination,
            surveyExamination: $scope.newDescFile.surveyExamination,
            date: $scope.newDescFile.date,
            planNumber: $scope.newDescFile.planNumber,
            geotechnicalInvestigation: $scope.newDescFile.geotechnicalInvestigation,
            soilStress: $scope.newDescFile.soilStress,
            fundationMode: $scope.newDescFile.fundationMode,
            couche: $scope.newDescFile.couche,
            nappePresence: $scope.newDescFile.nappePresence,
            habitationType: $scope.newDescFile.habitationType,
            permanentLoad: $scope.newDescFile.permanentLoad,
            exploitationLoad: $scope.newDescFile.exploitationLoad,
            levelsNumber: $scope.newDescFile.levelsNumber,
            interstageMaxHeight: $scope.newDescFile.interstageMaxHeight,
            buildingHeight: $scope.newDescFile.buildingHeight,
            poutreMaxRange: $scope.newDescFile.poutreMaxRange,
            consoleMaxRange: $scope.newDescFile.consoleMaxRange,
            pafMaxRange: $scope.newDescFile.pafMaxRange,
            panelType: $scope.newDescFile.panelType,
            concentratedLoads: $scope.newDescFile.concentratedLoads,
            percentage: $scope.newDescFile.percentage,
            site: $scope.newDescFile.site,
            behaviorCoeff: $scope.newDescFile.behaviorCoeff,
            dynamicCoeff: $scope.newDescFile.dynamicCoeff,
            bracingType: $scope.newDescFile.bracingType,
            buildingClass: $scope.newDescFile.buildingClass,
        }, function (descFile) {
            if ($scope.newDescFile.version == 0) {
                notificationService.notify({
                    title: 'Fiche descriptive créée',
                    text: 'Le fiche descriptive "' + $scope.project.name + '" a été créée',
                    icon: 'fa fa-plus',
                    type: 'success',
                    animate_speed: 'fast',
                });
            } else {
                notificationService.notify({
                    title: 'Fiche descriptive modifiée',
                    text: 'Le fiche descriptive "' + $scope.project.name + '" a été modifiée',
                    icon: 'fa fa-edit',
                    type: 'success',
                    animate_speed: 'fast',
                });
            }
            descriptionFileService.getAllByProject($scope.project.id, function (data) {
                $scope.allVersions = data;
            });
            descriptionFileService.getLastVersion($scope.project.id, function (data) {
                $scope.newDescFile = data;
                $scope.newDescFile.date = $filter('date')(data.date, 'yyyy-MM-dd');
            });
        })
    }

    $scope.getDescFile = function (descFileId) {
        descriptionFileService.getById(descFileId, function (data) {
            $scope.newDescFile = data;
            $scope.newDescFile.date = $filter('date')(data.date, 'yyyy-MM-dd');
        });
    }

}]);