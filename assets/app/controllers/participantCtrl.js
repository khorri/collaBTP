//PARTICIPANT CONTROLLER

app.controller('participantCtrl', ['$scope', '$resource', 'navService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$sails', 'userService', 'participantService', 'typeService', '$stateParams', 'allParticipants', function ($scope, $resource, navService, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $sails, userService, participantService, typeService, $stateParams, allParticipants) {

//    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(10);
//
//    $scope.dtColumnDefs = [
//      DTColumnDefBuilder.newColumnDef(0),
//    DTColumnDefBuilder.newColumnDef(1),
//    DTColumnDefBuilder.newColumnDef(2),
//    DTColumnDefBuilder.newColumnDef(3).notSortable(),
//    DTColumnDefBuilder.newColumnDef(4).notSortable(),
//    DTColumnDefBuilder.newColumnDef(5).notSortable(),
// ];
//
//    $scope.participants = [];
//    $scope.allTypes = []
//    $scope.newPart = {}
//    $scope.currentPart = {}
//
//    $scope.refreshData = function () {
//        participantService.getAll(function () {
//            $scope.participants = participantService.participants;
//        });
//        typeService.getAll(function () {
//            $scope.allTypes = typeService.types;
//        });
//    }
//
//    typeService.getAll(function () {
//        $scope.allTypes = typeService.types;
//    });
//    participantService.getAll(function () {
//        $scope.participants = participantService.participants;
//    });
//
//    $scope.openAddParticipantModal = function () {
//        ngDialog.open({
//            template: 'addParticipantModal',
//            scope: $scope,
//            showClose: true,
//            closeByDocument: false,
//            closeByEscape: false,
//            className: 'ngdialog-theme-default ngdialog-big'
//        });
//    }
//    $scope.openDeleteParticipantModal = function (participantId) {
//        $scope.currentParticipantId = participantId;
//        ngDialog.open({
//            template: 'deleteParticipantModal',
//            scope: $scope,
//            showClose: true,
//            closeByDocument: false,
//            closeByEscape: false,
//            className: 'ngdialog-theme-default ngdialog-small'
//        });
//    }
//    $scope.openUpdateParticipantModal = function (participantId) {
//        participantService.getById(participantId, function (participant) {
//            $scope.currentPart = participant;
//        });
//        ngDialog.open({
//            template: 'updateParticipantModal',
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
//    $scope.createParticipant = function (newParticipant) {
//        participantService.add({
//            contactPerson: newParticipant.contactPerson,
//            phone: newParticipant.phone,
//            email: newParticipant.email,
//            address: newParticipant.address,
//            company: newParticipant.company,
//            cellphone: newParticipant.cellphone,
//            zip: newParticipant.zip,
//            type: newParticipant.type,
//        }, function () {
//            //            $scope.participants.push(newParticipant);
//            $scope.newPart = {};
//            $scope.refreshData();
//        })
//    }
//    $scope.updateParticipant = function () {
//        participantService.update({
//            contactPerson: $scope.currentPart.contactPerson,
//            phone: $scope.currentPart.phone,
//            email: $scope.currentPart.email,
//            address: $scope.currentPart.address,
//            company: $scope.currentPart.company,
//            cellphone: $scope.currentPart.cellphone,
//            zip: $scope.currentPart.zip,
//            type: $scope.currentPart.type.id,
//            id: $scope.currentPart.id
//        }, function () {
//            //            var index = $scope.participants.indexOf($scope.currentPart.id)
//            //            $scope.participants.splice(index, 1);
//            //            $scope.participants.splice(index, 0, $scope.currentPart);
//            $scope.currentPart = {};
//            $scope.refreshData();
//        })
//    }
//    $scope.deleteParticipant = function (currentParticipantId) {
//        participantService.remove(currentParticipantId, function () {
//            //            var index = $scope.participants.indexOf(currentParticipantId);
//            //            $scope.participants.splice(index, 1);
//            $scope.currentParticipantId = {};
//            $scope.refreshData();
//        });
//    }


}]);