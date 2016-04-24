//CUSTOMER CONTROLLER

app.controller('customerCtrl', ['$scope', '$resource', 'navService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$sails', 'userService', 'customerService', '$stateParams', 'allCustomers', 'typeService', function ($scope, $resource, navService, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $sails, userService, customerService, $stateParams, allCustomers, typeService) {

//    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10);
 //
 //    $scope.dtColumnDefs = [
 //  DTColumnDefBuilder.newColumnDef(0),
 //  DTColumnDefBuilder.newColumnDef(1),
 //  DTColumnDefBuilder.newColumnDef(2),
 //  DTColumnDefBuilder.newColumnDef(3).notSortable(),
 //  DTColumnDefBuilder.newColumnDef(4).notSortable(),
 //  DTColumnDefBuilder.newColumnDef(5).notSortable(),
 // ];
 //
 //    $scope.customers = [];
 //    $scope.allTypes = []
 //    $scope.newCust = {}
 //    $scope.currentCust = {}
 //
 //    typeService.getAll(function () {
 //        $scope.allTypes = typeService.types;
 //    });
 //    customerService.getAll(function () {
 //        $scope.customers = customerService.customers;
 //    });
 //
 //    $scope.openAddCustomerModal = function () {
 //        ngDialog.open({
 //            template: 'addCustomerModal',
 //            scope: $scope,
 //            showClose: true,
 //            closeByDocument: false,
 //            closeByEscape: false,
 //            className: 'ngdialog-theme-default ngdialog-big'
 //        });
 //    }
 //    $scope.openDeleteCustomerModal = function (customerId) {
 //        $scope.currentCustomerId = customerId;
 //        ngDialog.open({
 //            template: 'deleteCustomerModal',
 //            scope: $scope,
 //            showClose: true,
 //            closeByDocument: false,
 //            closeByEscape: false,
 //            className: 'ngdialog-theme-default ngdialog-small'
 //        });
 //    }
 //    $scope.openUpdateCustomerModal = function (customerId) {
 //        customerService.getById(customerId, function (customer) {
 //            $scope.currentCust = customer;
 //        });
 //        ngDialog.open({
 //            template: 'updateCustomerModal',
 //            scope: $scope,
 //            showClose: true,
 //            closeByDocument: false,
 //            closeByEscape: false,
 //            className: 'ngdialog-theme-default ngdialog-big'
 //        });
 //    }
 //    $scope.closeModal = function () {
 //        ngDialog.closeAll();
 //    }
 //    $scope.createCustomer = function (newCustomer) {
 //        customerService.add({
 //            contactPerson: newCustomer.contactPerson,
 //            phone: newCustomer.phone,
 //            email: newCustomer.email,
 //            address: newCustomer.address,
 //            company: newCustomer.company,
 //            cellphone: newCustomer.cellphone,
 //            zip: newCustomer.zip,
 //            type: newCustomer.type,
 //        }, function () {
 //            $scope.customers.push(newCustomer);
 //            $scope.newCust = {};
 //        })
 //    }
 //    $scope.updateCustomer = function () {
 //        customerService.update({
 //            contactPerson: $scope.currentCust.contactPerson,
 //            phone: $scope.currentCust.phone,
 //            email: $scope.currentCust.email,
 //            address: $scope.currentCust.address,
 //            company: $scope.currentCust.company,
 //            cellphone: $scope.currentCust.cellphone,
 //            zip: $scope.currentCust.zip,
 //            type: $scope.currentCust.type.id,
 //            id: $scope.currentCust.id
 //        }, function () {
 //            var index = $scope.customers.indexOf($scope.currentCust.id)
 //            $scope.customers.splice(index, 1);
 //            $scope.customers.splice(index, 0, $scope.currentCust);
 //            $scope.currentCust = {};
 //        })
 //    }
 //    $scope.deleteCustomer = function (currentCustomerId) {
 //        customerService.remove(currentCustomerId, function () {
 //            var index = $scope.customers.indexOf(currentCustomerId);
 //            $scope.customers.splice(index, 1);
 //            $scope.currentCustomerId = {};
 //        });
 //    }

}]);