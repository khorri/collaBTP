// ADMIN CONTROLLER

app.controller('adminCtrl', ['$scope', '$resource', 'navService', 'ngDialog', '$filter', '$sails', 'userService', 'paymentMethodService', 'typeService', 'customerService', '$stateParams', 'participantService', 'notificationService', 'roleService', 'permissionService',
    function ($scope, $resource, navService, ngDialog, $filter, $sails, userService, paymentMethodService, typeService, customerService, $stateParams, participantService, notificationService, roleService, permissionService) {


        $scope.customers = [];
        $scope.allTypes = [];
        $scope.newCust = {};
        $scope.currentCust = {};
        $scope.isCreatingNewCustomer = false;
        $scope.isUpdatingCustomer = false;
        $scope.isEditingImage = false;


        var _reset = function(){
            $scope.newCust = {};
            $scope.currentCust = {};
            $scope.newPart = {};
            $scope.currentPart = {};
            $scope.newType = {};
            $scope.newRole = {};
        }

        typeService.getAll(function () {
            $scope.allTypes = typeService.types;
        });
        customerService.getAll(function () {
            $scope.customers = customerService.customers;
            $scope.displayedCustomerCollection = [].concat($scope.customers);
        });

        $scope.refreshData = function () {
            customerService.getAll(function () {
                $scope.customers = customerService.customers;
            });
        }

        $scope.openAddCustomerModal = function () {
            ngDialog.open({
                template: 'addCustomerModal',
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
        $scope.openDeleteCustomerModal = function (customerId) {
            $scope.currentCustomerId = customerId;
            ngDialog.open({
                template: 'deleteCustomerModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-small'

            });
        }
        $scope.openUpdateCustomerModal = function (customerId) {
            customerService.getById(customerId, function (customer) {
                $scope.currentCust = customer;
            });
            ngDialog.open({
                template: 'updateCustomerModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }
        $scope.closeModal = function () {
            ngDialog.closeAll();
        }
        $scope.createCustomer = function (newCustomer) {
            $scope.isCreatingNewCustomer = true;
            customerService.add({
                contactPerson: newCustomer.contactPerson,
                phone: newCustomer.phone,
                email: newCustomer.email,
                address: newCustomer.address,
                company: newCustomer.company,
                cellphone: newCustomer.cellphone,
                zip: newCustomer.zip,
                type: newCustomer.type
            }, function () {
                notificationService.notify({
                    title: 'Client ajouté',
                    text: 'Le client "' + newCustomer.contactPerson + '" a été ajouté',
                    icon: 'fa fa-plus',
                    type: 'success',
                    animate_speed: 'fast'
                });
                $scope.isCreatingNewCustomer = false;
                customerService.getAll();
                $scope.customers = customerService.customers;
                $scope.newCust = {};
            })
        }
        $scope.updateCustomer = function () {
            $scope.isUpdatingCustomer = true;
            customerService.update({
                contactPerson: $scope.currentCust.contactPerson,
                phone: $scope.currentCust.phone,
                email: $scope.currentCust.email,
                address: $scope.currentCust.address,
                company: $scope.currentCust.company,
                cellphone: $scope.currentCust.cellphone,
                zip: $scope.currentCust.zip,
                type: $scope.currentCust.type.id,
                id: $scope.currentCust.id
            }, function () {
                notificationService.notify({
                    title: 'Client modifié',
                    text: 'Le client "' + $scope.currentCust.contactPerson + '" a été modifié',
                    icon: 'fa fa-edit',
                    type: 'success',
                    animate_speed: 'fast'
                });
                $scope.isUpdatingCustomer = false;
                customerService.getAll();
                $scope.customers = customerService.customers;
                $scope.currentCust = {};
            })
        }
        $scope.deleteCustomer = function (currentCustomerId) {
            customerService.remove(currentCustomerId, function () {
                // $scope.refreshData();
                customerService.getAll();
                $scope.customers = customerService.customers;
                $scope.currentCustomerId = {};
            });
        }

        //INTERVENANT LOGIC

        $scope.participants = [];
        $scope.allTypes = []
        $scope.newPart = {}
        $scope.currentPart = {}
        $scope.isCreatingNewParticipant = false;
        $scope.isUpdatingParticipant = false;

        $scope.refreshData = function () {
            participantService.getAll(function () {
                $scope.participants = participantService.participants;
                $scope.displayedPartCollection = [].concat($scope.participants);
            });
            typeService.getAll(function () {
                $scope.allTypes = typeService.types;
            });
        }

        typeService.getAll(function () {
            $scope.allTypes = typeService.types;
        });
        participantService.getAll(function () {
            $scope.participants = participantService.participants;
        });

        $scope.openAddParticipantModal = function () {
            ngDialog.open({
                template: 'addParticipantModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big',
                preCloseCallback: function(value) {
                   // _reset();
                    return true;
                }
            });
        }
        $scope.openDeleteParticipantModal = function (participantId) {
            $scope.currentParticipantId = participantId;
            ngDialog.open({
                template: 'deleteParticipantModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-small'
            });
        }
        $scope.openUpdateParticipantModal = function (participantId) {
            participantService.getById(participantId, function (participant) {
                $scope.currentPart = participant;
            });
            ngDialog.open({
                template: 'updateParticipantModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }
        $scope.closeModal = function () {
            ngDialog.closeAll();
        }
        $scope.createParticipant = function () {
            $scope.isCreatingNewParticipant = true;
            participantService.add($scope.newPart, function () {
                notificationService.notify({
                    title: 'Intervenant ajouté',
                    text: 'L\'intervenant "' + $scope.newPart.contactPerson + '" a été ajouté',
                    icon: 'fa fa-plus',
                    type: 'success',
                    animate_speed: 'fast'
                });
                $scope.isCreatingNewParticipant = false;
                $scope.newPart = {};
                $scope.refreshData();
            })
        }
        $scope.updateParticipant = function () {
            $scope.isUpdatingParticipant = true;
            participantService.update({
                contactPerson: $scope.currentPart.contactPerson,
                phone: $scope.currentPart.phone,
                email: $scope.currentPart.email,
                address: $scope.currentPart.address,
                company: $scope.currentPart.company,
                cellphone: $scope.currentPart.cellphone,
                zip: $scope.currentPart.zip,
                type: $scope.currentPart.type.id,
                id: $scope.currentPart.id
            }, function () {
                notificationService.notify({
                    title: 'Intervenant modifié',
                    text: 'L\'intervenant "' + $scope.currentPart.contactPerson + '" a été modifié',
                    icon: 'fa fa-edit',
                    type: 'success',
                    animate_speed: 'fast'
                });
                $scope.isUpdatingParticipant = false;
                $scope.currentPart = {};
                $scope.refreshData();
            })
        }
        $scope.deleteParticipant = function (currentParticipantId) {
            participantService.remove(currentParticipantId, function () {
                $scope.currentParticipantId = {};
                $scope.refreshData();
            });
        }


        //TYPE LOGIC
        $scope.newType = {};
        $scope.isCreatingNewType = false;
        $scope.isUpdatingType = false;
        $scope.openAddTypeModal = function () {
            ngDialog.open({
                template: 'addTypeModal',
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
        $scope.createType = function() {
            $scope.isCreatingNewType = true;
            typeService.add($scope.newType, function () {
                $scope.isCreatingNewType = false;
                $scope.newType = {};
                $scope.refreshData();
            });
        }
        $scope.openUpdateTypeModal = function (type) {
            $scope.currentType = {}
            angular.copy(type, $scope.currentType);
            ngDialog.open({
                template: 'updateTypeModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }
        $scope.updateType = function () {
            $scope.isUpdatingType = true;
            typeService.update($scope.currentType, function () {
                $scope.isUpdatingType = false;
                $scope.currentType = {};
                $scope.refreshData();
            });
        }
        $scope.openDeleteTypeModal = function (typeId) {
            $scope.currentTypeId = typeId;
            ngDialog.open({
                template: 'deleteTypeModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-small'
            });
        }
        $scope.deleteType = function (typeId) {
            typeService.remove(typeId, function () {
                $scope.typeId = {};
                $scope.refreshData();
            });
        }

        //ROLES LOGIC
        $scope.newRole = {};
        $scope.isCreatingNewRole = false;
        $scope.isUpdatingRole = false;
        $scope.allRoles = [];
        $scope.allPermissions = [];

        roleService.getAll(function (roles) {
            $scope.allRoles = roles;
        });
        permissionService.getAll(function (permissions) {
            $scope.allPermissions = permissions;
        });
        $scope.refreshData = function () {
            roleService.getAll(function (roles) {
                $scope.allRoles = roles;
            });
        }

        $scope.openAddRoleModal = function () {
            ngDialog.open({
                template: 'addRoleModal',
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
        $scope.createRole = function() {
            $scope.isCreatingNewRole = true;
            roleService.add($scope.newRole, function () {
                $scope.isCreatingNewRole = false;
                $scope.newRole = {};
                $scope.refreshData();
            });
        }

        $scope.openUpdateRoleModal = function (role) {
            $scope.currentRole = {}
            angular.copy(role, $scope.currentRole);
            ngDialog.open({
                template: 'updateRoleModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }
        $scope.updateRole = function () {
            $scope.isUpdatingRole = true;
            roleService.update($scope.currentRole, function () {
                $scope.isUpdatingRole = false;
                $scope.currentRole = {};
                $scope.refreshData();
            });
        }

        $scope.openDeleteRoleModal = function (roleId) {
            $scope.currentRoleId = roleId;
            ngDialog.open({
                template: 'deleteRoleModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-small'
            });
        }
        $scope.deleteRole = function (roleId) {
            roleService.remove(roleId, function () {
                $scope.roleId = {};
                $scope.refreshData();
            });
        }





    }]);