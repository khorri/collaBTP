// PROFIL CONTROLLER

app.controller('invoicelistCtrl', ['$scope', 'userService', 'project', 'subProject', 'bills', function ($scope, userService, project, subProject, bills) {

	$scope.subProject = subProject.data;
	$scope.project = project.data;
	$scope.bills = bills.data;

}]);