// PROFIL CONTROLLER

app.controller('profilCtrl', ['$scope', 'navService', '$sails', 'userService', function ($scope, navService, $sails, userService) {

	$scope.loggedUser = userService.loggedUser;

}]);