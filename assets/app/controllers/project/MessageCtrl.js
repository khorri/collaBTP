app.controller('MessageCtrl', ['$rootScope', '$scope', 'loggedUser', 'project', 'subProjects', 'ngDialog', 'notificationService','$upload', '$window','commentService', function ($rootScope, $scope, loggedUser, project, subProjects, ngDialog, notificationService,$upload, $window,commentService) {

    $scope.project = project.data;
    $scope.selectedRecipients = [];
    $scope.emailSubject = '';
    $scope.emailBody='';
    $scope.loggedUser = loggedUser;
    $scope.iconSize = ' fa-3x';
    $scope.personTosend = (function(){
        var recipients = [];
        angular.forEach($scope.project.contributors, function(item,index){
            recipients.push({
                name:item.name,
                email:item.email
            });
           // $scope.selectedRecipients.push(item.email);
        });
        angular.forEach($scope.project.participants,function(item,index){
            recipients.push({
                name:item.company,
                email:item.email
            });
           // $scope.selectedRecipients.push(item.email);
        });
        recipients.push({
            name :$scope.project.customer.company,
            email : $scope.project.customer.email
        });
        recipients.push({
            name :$scope.project.projectLeader.name,
            email : $scope.project.projectLeader.email
        });
        //$scope.selectedRecipients.push($scope.project.customer.email);
        return recipients;

    }());
    function loadMessages() {
        commentService.getByProject($scope.project.id, function () {
            $scope.messages = commentService.messages;
        });
    };
    loadMessages();
    console.log($scope.messages);

    $scope.openMessageDialog = function () {
        ngDialog.open({
            template: 'messageDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large',
            preCloseCallback: function(value) {
                $scope.files=[];
                $scope.emailSubject ='';
                $scope.emailBody='';
                delete $scope.isAttachmentReady;
                $scope.selectedRecipients =[];
                return true;
            }
        });
    }
    $scope.send = function(){

        commentService.send({
            from: 'info@collabtp.com',
            to: $scope.selectedRecipients,
            sender :loggedUser.data ,
            subject: $scope.emailSubject,
            text: $scope.emailBody,
            html: $scope.emailBody,
            project : $scope.project,
            attachment:$scope.attachments
        },function(data){
            console.log(data);
                if (data.error) {
                    notificationService.notify({
                        title: "Erreur lors de l'envoie du message",
                        text:  data.info,
                        icon: 'fa fa-exclamation-triangle',
                        type: 'error',
                        animate_speed: 'fast'
                    });
                    console.log(data.error)
                } else {
                    notificationService.notify({
                        title: "Message Envoyé",
                        text: "Message envoyé avec succès",
                        icon: 'fa fa-envelope',
                        type: 'success',
                        animate_speed: 'fast'
                    });
                    loadMessages();
                    $scope.closeAndClearModal();
                }

        });

    };

    $scope.upload = function (files) {
        if (files && files.length) {
                $scope.isAttachmentReady=false;
                $upload.upload({
                    url: '/file/uploadMessageAttachments',
                    fileFormDataName: 'files',
                    file: files,
                    fields: {
                        projectId: $scope.project.id
                    }
                }).progress(function (evt) {
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.isAttachmentReady = true;
                    $scope.attachments = data;
                });
            }

    };

    $scope.closeAndClearModal = function () {
        ngDialog.closeAll();
        $scope.files=[];
        $scope.emailSubject ='';
        $scope.emailBody='';
        delete $scope.isAttachmentReady;
        $scope.selectedRecipients =[];
    };

    $scope.viewAttachedFile = function (file) {
        if(file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1){
            $scope.isPopUpOpen = true;
            $scope.currentMedia = file;
        }
        else {
            $window.open(file.webPath);
        }
    };

    $scope.closePopUp = function() {
        $scope.isPopUpOpen = false;
        $scope.currentMedia = {};
    };

    $scope.openDeleteMessage = function (message) {
        $scope.messageToDel = message;
        ngDialog.open({
            template: 'deleteMessageModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }
    $scope.deleteMessage = function(){
        console.log("deleting the message"+ $scope.messageToDel.subject);
        commentService.remove($scope.messageToDel,function(data){
            if (data.error) {
                notificationService.notify({
                    title: "Erreur lors de la suppression du message"+$scope.messageToDel.subject,
                    text:  data.info,
                    icon: 'fa fa-exclamation-triangle',
                    type: 'error',
                    animate_speed: 'fast'
                });
                console.log(data.error)
            } else {
                notificationService.notify({
                    title: "Message Supprimé",
                    text: "Message supprimé avec succès",
                    icon: 'fa fa-envelope',
                    type: 'success',
                    animate_speed: 'fast'
                });
                loadMessages();
            }
        })
    };
    $scope.openEditMessage = function (message) {
        console.log("Not yet implemented!!!");
         //if() message.,

         /*   $scope.emailSubject = message.subject;
          $scope.emailBody = message.content;

        ngDialog.open({
            template: 'messageDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-large',
            preCloseCallback: function(value) {
                $scope.files=[];
                $scope.emailSubject ='';
                $scope.emailBody='';
                delete $scope.isAttachmentReady;
                $scope.selectedRecipients =[];
                return true;
            }
        });*/
    };
    $scope.deleteAttachedFile = function(f){
        var index = $scope.files.indexOf(f);
        $scope.files.splice(index, 1);
        $scope.attachments.splice(index, 1);

    };

}]);
