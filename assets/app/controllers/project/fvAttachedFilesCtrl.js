app.controller('fvAttachedFilesCtrl', ['$scope', 'userService', 'project', 'activity', 'attachedFiles', '$upload', 'ngDialog', 'activityService', '$window', function ($scope, userService, project, activity, attachedFiles, $upload, ngDialog, activityService, $window) {
    $scope.currentMedia = {};
    $scope.loggedUser = userService.loggedUser;
    $scope.project = project.data;
    $scope.activity = activity.data;
    $scope.attachedFiles = attachedFiles.data;
    $scope.files = [];
    $scope.isAttachingFiles = false;
    $scope.isPopUpOpen = false;

    $scope.fileSelected = function (files, event) {
        $scope.upload(files)
    }

    $scope.upload = function (files) {
        if (files) {
            $scope.isAttachingFiles = true;
            $upload.upload({
                url: '/file/uploadFieldVisitFiles',
                fileFormDataName: 'files',
                file: files,
                fields: {
                    id: $scope.activity.id
                }
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.attachedFiles = data;
                $scope.files = [];
                $scope.isAttachingFiles = false;
            });
        }
    }

    $scope.closeModal = function () {
        ngDialog.closeAll();
    }

    $scope.openDeleteAttachedFile = function (file) {
        $scope.fileToDel = file;
        ngDialog.open({
            template: 'deleteAttachedFileModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }

    $scope.deleteAttachedFile = function () {
        activityService.deleteAttachedFile({
            fileId: $scope.fileToDel.id,
            activityId: $scope.activity.id
        }, function (result) {
            $scope.attachedFiles = result;
        });
    }

    $scope.viewAttachedFile = function (file) {
        if(file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1){
            $scope.isPopUpOpen = true;
            $scope.currentMedia = file;
        }
        else {
            $window.open(file.webPath);
        }
    }

    $scope.closePopUp = function() {
        $scope.isPopUpOpen = false;
        $scope.currentMedia = {};
    }
    $scope.openSendFvModal = function(){
        _loadParticipant();

        $scope.emailSubject = "Fiche de contrôle -- Affaire : "+$scope.project.name;

        ngDialog.open({
            template: 'sendFvModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large'
        });
    }
    $scope.sendFvToParticipants = function(){
        var link = location.hostname+":"+location.port+"/activity/genarateZipArchive/"+$scope.activity.id;
        console.log(link);
        activityService.sendEmail({
            from: 'info@collabtp.com',
            to: $scope.selectedParticipants,
            subject: $scope.emailSubject,
            text: $scope.emailBody+"Merci de copier/coller le lien suivant dans un navigateur web : "+link,
            html: $scope.emailBody+'<br/> Merci de cliquer sur le lien suivant pour télécharger la fiche contrôle:<br/><a href="http://'+link+'">Fiche de contrôle </a>',
            attachments: []
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
                ngDialog.closeAll();
            }
            $scope.isSendingDocExam = false;
        })
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
}]);