app.controller('docExamCtrl', ['$rootScope', '$scope', 'loggedUser', 'project', 'subProjects', 'docExaminations', 'docExaminationService', 'ngDialog', 'notificationService', '$window', function ($rootScope, $scope, loggedUser, project, subProjects, docExaminations, docExaminationService, ngDialog, notificationService, $window) {

    $scope.project = project.data;
    $scope.docExaminations = docExaminations.data;
    $scope.newDocExam = {};
    $scope.currentDocExam = {};
    $scope.examDocs = [];
    $scope.isGeneretingDocExam = false;
    $scope.isSendingDocExam = false;
    $scope.selectedParticipants = [];
    $scope.header = false;
    $scope.subProjects = subProjects.data;
    $scope.emailSubject = '[Examination de document]: Projet ' + $scope.project.ref;
    $scope.emailBody = '';
    $scope.elementSelected = false;
    $scope.contributors = _loadContributors();

    $scope.reload = function () {
        docExaminationService.getAllByProject($scope.project.id, function () {
            $scope.docExaminations = docExaminationService.docExaminations;
        })
    }

    $scope.closeModal = function () {
        ngDialog.closeAll();
    }

    $scope.openUpdateDocExaminationDialog = function (docexam) {
        $scope.currentDocExam = angular.copy($scope.docExaminations[$scope.docExaminations.indexOf(docexam)]);
        ngDialog.open({
            template: 'updateDocExaminationModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large',
            preCloseCallback: function(value) {
               // _reset();
                return true;
            }
        });
    }

    $scope.openSendDocExaminationModal = function () {
        _loadParticipant();
        ngDialog.open({
            template: 'sendDocExaminationModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large',
            preCloseCallback: function(value) {
               // _reset();
                return true;
            }
        });
    }

    $scope.createDocExamination = function () {
        docExaminationService.add({
            label: $scope.newDocExam.label,
            description: $scope.newDocExam.description,
            mailNum: $scope.newDocExam.mailNum,
            project: $scope.project.id,
            contributor: $scope.newDocExam.contributor.id
        }, function () {
            docExaminationService.single.project = $scope.project;
            $scope.reload();
            $scope.closeModal();
            $scope.newDocExam = {};
        })
    }

    $scope.updateDocExamination = function () {
        docExaminationService.update({
            id: $scope.currentDocExam.id,
            project: $scope.project.id,
            label: $scope.currentDocExam.label,
            mailNum: $scope.currentDocExam.mailNum,
            description: $scope.currentDocExam.description,
            contributor: $scope.currentDocExam.contributor.id,
        }, function (data) {
            $scope.docExaminations = data;
            $scope.currentDocExam = {};
            $rootScope.$emit('resetSelect');
        });
    }


    $scope.openAddDocExaminationDialog = function () {
        ngDialog.open({
            template: 'addDocExaminationModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large',
            preCloseCallback: function(value) {
                //_reset();
                return true;
            }
        });
    }

   var _reset = function(){
       $scope.newDocExam = {};
       $scope.currentDocExam = {};
       $scope.examDocs = [];
       $scope.isGeneretingDocExam = false;
       $scope.isSendingDocExam = false;
       $scope.selectedParticipants = [];
       $scope.header = false;
   }
    $scope.openDeleteDocExaminationModal = function (docExam) {
        $scope.currentdocExam = docExam;
        ngDialog.open({
            template: 'DeleteDocExaminationModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }

    $scope.deleteDocExamination = function (docExamID) {
        docExaminationService.remove(docExamID, function () {
            $scope.reload();
            $scope.currentdocExam = {};
        });
    }


    $scope.createDocument = function () {
        $scope.isGeneretingDocExam = true;
        docExaminationService.createDocument({
            ourCompany: 'Risk Control',
            ourCompanyAddress: 'hay El Oulfa, GH4B, résidence Arreda n°25 appt. n°3 Quartier: Oulfa CASABLANCA',
            projectRef: $scope.project.ref,
            projectName: $scope.project.name,
            projectLeader: $scope.project.projectLeader.name,
            projectAddress: $scope.project.address,
            customer: $scope.project.customer.company,
            city: $scope.project.city,
            participants: $scope.project.participants,
            contributor: $scope.examDocs[0].contributor.name,
            examDocs: $scope.examDocs,
            missions: _allProjectMissions(),
            header: $scope.header
        }, function (file) {
            $window.open(file.webPath);
            $scope.isGeneretingDocExam = false;
        })
    }

    $scope.sendDocToParticipants = function () {
        $scope.closeModal();
        $scope.isSendingDocExam = true;
        docExaminationService.createDocument({
            ourCompany: 'Risk Control',
            ourCompanyAddress: 'hay El Oulfa, GH4B, résidence Arreda n°25 appt. n°3 Quartier: Oulfa CASABLANCA',
            projectRef: $scope.project.ref,
            projectName: $scope.project.name,
            projectLeader: $scope.project.projectLeader.name,
            projectAddress: $scope.project.address,
            customer: $scope.project.customer.company,
            city: $scope.project.city,
            participants: $scope.project.participants,
            contributors: $scope.project.contributors,
            examDocs: $scope.examDocs,
            missions: _allProjectMissions(),
            header: true
        }, function (file) {
            docExaminationService.sendEmail({
                from: 'info@collabtp.com',
                to: $scope.selectedParticipants,
                subject: $scope.emailSubject,
                text: $scope.emailBody,
                html: $scope.emailBody,
                attachments: [{
                    filename: file.name,
                    path: file.absolutePath
                }]
            }, function (data) {
                if (data.error) {
                    notificationService.notify({
                        title: "Erreur lors de l'envoie de l'email",
                        text: data.error.responseCode + ': ' + data.error.code,
                        icon: 'fa fa-exclamation-triangle',
                        type: 'error',
                        animate_speed: 'fast'
                    });
                    console.log(data.error)
                } else {
                    notificationService.notify({
                        title: "Document envoyé",
                        text: "Document envoyé via email",
                        icon: 'fa fa-envelope',
                        type: 'success',
                        animate_speed: 'fast'
                    });
                }
                $scope.isSendingDocExam = false;
            })

        })
    }

    $rootScope.$on('checkBoxChecked', function () {
        $scope.checkSelected()
    });

    $scope.checkSelected = function () {
        $scope.examDocs = []
        angular.forEach($scope.docExaminations, function (docExam, index) {
            if (docExam.isSelected) {
                $scope.elementSelected = false;
                $scope.examDocs.push(docExam)
            }
        });
        if($scope.examDocs.length > 0){
            $scope.elementSelected = true;
        }else{
            $scope.elementSelected = false;
        }
    }


    function _loadParticipant() {
        $scope.selectedParticipants = [];
        $scope.personTosend = [];
        angular.forEach($scope.project.participants, function (item, index) {
            $scope.selectedParticipants.push(item.email)
            $scope.personTosend.push(item)
        })

        $scope.selectedParticipants.push($scope.project.customer.email);
        $scope.personTosend.push($scope.project.customer);
    }

    function _allProjectMissions() {
        var allMissions = [];
        angular.forEach($scope.subProjects, function (item) {
            allMissions.push.apply(allMissions, item.missions)
        });
        return allMissions;
    }

    function _loadContributors(){
        var allcontributors = [];
        angular.forEach($scope.project.contributors, function (item) {
            allcontributors.push(item)
        });
        allcontributors.push($scope.project.projectLeader)
        return allcontributors;
    }

}]);