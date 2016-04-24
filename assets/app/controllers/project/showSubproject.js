app.controller('showSubprojectCtrl', ['$scope', 'subProject', 'paymentMethods', 'project', 'subProjectService', 'projectService', 'customerService', 'notificationService', '$window', function ($scope, subProject, paymentMethods, project, subProjectService, projectService, customerService, notificationService, $window) {

    $scope.subProject = subProject.data;
    $scope.project = project.data;
    $scope.paymentMethods = paymentMethods.data;
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

        }, function (file) {
            notificationService.notify({
                title: 'Contrat généré',
                text: 'Contrat généré avec succès',
                icon: 'fa fa-file-pdf-o',
                type: 'success',
                animate_speed: 'fast',
            });
            subProjectService.getById($scope.subProject.id, function (data) {
                $scope.subProject = data;
            });
            $window.open(file.webPath);
            $scope.isGenerating = false;
            $scope.genIndex = null;
        })
    }

}]);