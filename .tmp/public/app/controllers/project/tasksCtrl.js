app.controller('tasksCtrl', ['$scope', 'loggedUser', 'project', function ($scope, loggedUser, project) {
	$scope.project = project.data;
}]);