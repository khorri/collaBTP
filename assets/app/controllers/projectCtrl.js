app.controller('projectCtrl', ['$scope', 'loggedUser', 'allParticipants', 'allUsers', 'project', 'subProjects', 'allMissions', function ($scope, loggedUser, allParticipants, allUsers, project, subProjects, allMissions) {

	$scope.tabData = [
		{
			heading: 'Détails',
			route: 'project.details',
            icon: 'fa-cube'
		},
        {
			heading: 'Tâches',
			route: 'project.tasks',
            icon: 'fa-tasks'
		},
        {
            heading: 'Documents',
            route: 'project.files',
            icon: 'fa-folder-open'
        },
		{
			heading: 'Plans',
			route: 'project.plans',
            icon: 'fa-picture-o'
		},
        {
            heading: 'Messages',
            route: 'project.messages',
            icon: 'fa-envelope'
        },
		{
			heading: 'Missions',
			route: 'project.missions.details',
            icon: 'fa-wrench'
		},
		{
			heading: 'Examination de document',
			route: 'project.docExam',
            icon: 'fa-file-text'
		},
		{
			heading: 'Fiche descriptive',
			route: 'project.descriptionFile',
            icon: 'fa-clipboard'
		},
		{
			heading: 'Visites de chantier',
			route: 'project.fieldVisit.all',
            icon: 'fa-map-marker'
		},
	];

}]);