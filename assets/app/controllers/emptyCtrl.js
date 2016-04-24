app.controller('emptyCtrl',['$scope','notificationService',function($scope,notificationService){
    $scope.param = 0;
    $scope.increment = function () {
        $scope.param++;
    };
}]);