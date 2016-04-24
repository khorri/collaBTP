app.controller('fileCtrl', ['$scope', 'project', 'fileService', 'documents', 'ngDialog', 'notificationService', '$upload', 'subProjectService', '$state', function ($scope, project, fileService, documents, ngDialog, notificationService, $upload, subProjectService, $state) {
    'use strict';
    //getPlansOfProject
    $scope.displayedCollection = [].concat(documents.data);
    $scope.documents = documents.data;
    $scope.project = project.data;
    $scope.newDocument = {};
    $scope.isCreatingNewDocument = false;
    $scope.fileName = '';
    $scope.fileDescription = '';

    $scope.refreshData = function () {
        fileService.getByProject($scope.project, function (documents) {
            $scope.documents = documents;
            $scope.displayedCollection = [].concat($scope.documents);
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
        fileService.remove(doc.id, function () {
            notificationService.notify({
                title: 'document supprimé',
                text: 'Le document <b>' + doc.name + '</b> a été supprimé avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.currentDocument = {};
            $scope.refreshData();
        });
    }

    //Adding new document

    $scope.openAddDocModal = function () {
        ngDialog.open({
            template: 'addDocumentModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-big'
        });
    }

    //Upload a document

    $scope.$watch('files', function () {
        if ($scope.files != null) {
            $scope.upload($scope.files[0]);
        }
    });

    $scope.upload = function (file) {
        if (file) {
            $upload.upload({
                url: '/file/uploadDocument',
                fileFormDataName: 'doc',
                file: file
            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                console.log(data);

                data.isUploaded = true;
                $scope.newDocument = data;
                $scope.newDocument.ext = file.name.split(".").pop();
                $scope.files = [];
            });
        }
    };

    $scope.createDocument = function () {
        $scope.isCreatingNewDocument = true;
        $scope.newDocument.project = $scope.project;
        $scope.newDocument.title = $scope.fileName;
        $scope.newDocument.description = $scope.fileDescription;
        fileService.create($scope.newDocument, function (data) {
            $scope.isCreatingNewDocument = false;
            $scope.refreshData();
            $scope.closeModal();
        });
    }

    $scope.openUploadDialog = function (document) {
        $scope.currentDocument = document;
        $scope.minorVersion = $scope.currentDocument.lastVersion?(parseFloat($scope.currentDocument.lastVersion)*10 + 1)/10:'1.0';
        $scope.majorVersion = parseInt($scope.currentDocument.lastVersion) + 1+".0";
        $scope.version = $scope.minorVersion
        ngDialog.open({
            template: 'uploadDocumentModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-big'
        });
    }
    $scope.importNewVersion = function(doc){
        console.log($scope.currentDocument);
        console.log($scope.version);
        fileService.createNewVersion({
            rootFile: $scope.currentDocument,
            newFile: $scope.newDocument,
            project: $scope.project,
            comment: $scope.comment,
            version: $scope.version
        }, function (data) {
            $scope.isCreatingNewDocument = false;
            $scope.refreshData();
            $scope.closeModal();
        });

    }

    $scope.closeModal = function () {
        ngDialog.closeAll();
        $scope.newDocument = {};
        $scope.fileName = '';
        $scope.fileDescription = '';
        $scope.currentDocument={};
        $scope.version='';
        $scope.comment='';
        $scope.events=[];
    }


    $scope.side = '';

    $scope.events = [];

    $scope.showHistoryVersionDocModal = function(f){
        $scope.events=[];
        var versionIds = f.versions.map(function(v){
                return v.id;
        });
        fileService.getVersions({ids:versionIds},function(versions){
            console.log(versions);
            var i=0;
            angular.forEach(versions,function(version,key){
                var updated = moment(version.createdAt).format('D MMM YYYY');
                var hour = moment(version.createdAt).format('HH:mm');
                var v = {
                    id:i,
                    badgeClass: 'default',
                    badgeIconClass: '',
                    title: version.rootFile.name,
                    versionNumber: version.versionNumber,
                    when: 'Ajouté le '+updated+' à '+hour,
                    content: version.reason,
                    contentHtml: version.reason,
                    footerContentHtml:'<a ng-click="downloadDocument(\''+version.id+'\')" class="btn btn-xs btn-success"><i class="fa fa-download"></i></a> <a ng-click="openRemoveVersionDialog(\''+version.id+'\','+i+')" class="btn btn-xs btn-danger"><i class="fa fa-trash"></i></a>'

                }
                this.push(v);
                i++;
            },$scope.events);
            $scope.events.reverse();
            ngDialog.open({
                template: 'historyDocumentModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: true,
                className: 'ngdialog-theme-default ngdialog-fullscreen'
            });

        });


    }
    // optional: not mandatory (uses angular-scroll-animate)
    $scope.animateElementIn = function($el) {
        $el.removeClass('timeline-hidden');
        $el.addClass('bounce-in');
    };

    // optional: not mandatory (uses angular-scroll-animate)
    $scope.animateElementOut = function($el) {
        $el.addClass('timeline-hidden');
        $el.removeClass('bounce-in');
    };


    $scope.openRemoveVersionDialog = function(version,i){
        $scope.currentVersion = version;
        $scope.currentEventId = i;
        $scope.deleteDialog = ngDialog.open({
            template: 'DeleteVersionDocModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }

    $scope.removeVersion = function(id){

        fileService.removeVersion(id,function(data){
            notificationService.notify({
                title: 'document supprimé',
                text: 'Le document a été supprimé avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });

            var filteredEvents = $scope.events.filter(function(event){
                return event.id != $scope.currentEventId;
            });
            $scope.events = filteredEvents;
            $scope.refreshData();
            delete $scope.currentVersion;
            $scope.closeDeleteModal();

        });
    }
    $scope.closeDeleteModal = function(){
        $scope.deleteDialog.close();
    }

    $scope.openEditDialog = function (document) {
        $scope.currentDocument = document;
        ngDialog.open({
            template: 'updateDocumentModal',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true,
            className: 'ngdialog-theme-default ngdialog-big'
        });
    }

    $scope.updateDocument = function(){
        fileService.update($scope.currentDocument,function(data){
            notificationService.notify({
                title: 'document Modifié',
                text: 'Le document a été modifié avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.refreshData();
            $scope.currentDocument = {};
            $scope.closeModal();
        });
    }

    $scope.downloadDocument = function(id){
        fileService.downloadVersion({id:id},function(data){
            console.log(data);
        });
    }
}]);