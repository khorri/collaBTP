/**
 * Created by horri on 05/03/2015.
 */
// USER CONTROLLER

app.controller('userCtrl', ['$scope', '$upload', '$resource', 'navService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$filter', '$sails', 'userService', 'roleService', '$stateParams', 'notificationService',
    function ($scope, $upload, $resource, navService, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $filter, $sails, userService, roleService, $stateParams, notificationService) {

    //   USER METHOD LOGIC

    $scope.newUser = {};
    $scope.currentUser = {};
    $scope.loggedUser = {};
    $scope.users = [];
    $scope.roles = [];
    $scope.isCreatingNewUser = false;
    $scope.isUpdatingUser = false;
        $scope.displayedCollection = [];

        var _reset = function(){
            $scope.newUser = {};
            $scope.currentUser = {};
        }


        $scope.refreshData = function () {
        userService.getAll(function (users) {
            $scope.users = users;
            $scope.displayedCollection = [].concat($scope.users);
        });
        roleService.getAll(function (roles) {
            $scope.roles = roles;
        });

    };

    $scope.refreshData();
    userService.getLoggedUser(function (data) {
        $scope.loggedUser = data;
    })

    $scope.addUser = function (newUser) {
        $scope.isCreatingNewUser = true;
        userService.add(newUser, function () {
            notificationService.notify({
                title: 'Utilisateur ajouté',
                text: 'L\'utilisateur "' + $scope.newUser.name + '" a été ajouté',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.newUser = {};
            $scope.isCreatingNewUser = false;
            $scope.refreshData();
        });

    }
    $scope.updateUser = function () {
        $scope.isUpdatingUser = true;
        userService.update({
            name: $scope.userToUpdate.name,
            email: $scope.userToUpdate.email,
            phone: $scope.userToUpdate.phone,
            password: $scope.userToUpdate.password,
            confirmation: $scope.userToUpdate.confirmation,
            role: $scope.userToUpdate.role.id,
            id: $scope.userToUpdate.id
        }, function () {
            $scope.refreshData();
            notificationService.notify({
                title: 'Utilisateur modifié',
                text: 'L\'utilisateur "' + $scope.userToUpdate.name + '" a été modifié',
                icon: 'fa fa-edit',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.isUpdatingUser = false;
            $scope.userToUpdate = {};
        });
    }
    $scope.openAddUserDialog = function () {
        ngDialog.open({
            template: 'addUserDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ngdialog-big',
            preCloseCallback: function(value) {
                _reset();
                return true;
            }
        });
    }
    $scope.openUpdateUserDialog = function (user) {
        userService.getById(user.id, function (user) {
            $scope.userToUpdate = user;
        });
        ngDialog.open({
            template: 'updateUserDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ngdialog-big'
        });
    }

    $scope.closeModal = function () {
        $scope.user = {};
        ngDialog.closeAll();
    }
    $scope.openDeleteUserDialog = function (userId) {
        $scope.userId = userId;
        ngDialog.open({
            template: 'deleteUserDialog',
            scope: $scope,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ngdialog-small'
        });
    }
    $scope.deleteUser = function (userId) {
        userService.remove(userId, function () {
            notificationService.notify({
                title: 'Utilisateur supprimé',
                text: 'L\'utilisateur a été supprimé avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
            $scope.userId = {};
            $scope.refreshData();
        });
    }
    $scope.$watch('files', function () {
        if ($scope.files != null) {
            $scope.upload($scope.files[0]);
        }
    });

    $scope.upload = function (files) {
        var file = files[0];
        if (file) {

            $upload.upload({
                url: '/file/uploadAvatar',
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);

            });

        }
    };
        

}]);