app.controller('detailsCtrl', ['$scope', 'loggedUser', 'allParticipants', 'allUsers', 'allDirectersEngineers', 'allCustomers', 'project', 'subProjects', 'projectService', '$state', 'moment',
    function ($scope, loggedUser, allParticipants, allUsers, allDirectersEngineers, allCustomers, project, subProjects, projectService, $state, moment) {

    $scope.project = project.data;
    $scope.subprojects = subProjects.data;
    $scope.allParticipants = allParticipants;
    $scope.allUsers = allUsers;
    $scope.allDirectersEngineers = allDirectersEngineers;
    $scope.allCustomers = allCustomers;
    $scope.isProjectEdit = false;
    $scope.projectParticipants = $scope.project.participants;
    $scope.descriptionFiles = $scope.project.descriptionFiles;
    $scope.descFileVersions = $scope.project.descriptionFiles.length;
    $scope.loggedUser = loggedUser.data;
    $scope.contributors = [];
    $scope.allParticipantsToEdit = _remainingParticipants();
    $scope.allContributorsToEdit = _remainingContributors();
    $scope.tmpProject = {};
    $scope.isUpdating = false;
    $scope.percent = (function(){
           var start = moment($scope.project.starts);
           var ends = moment($scope.project.ends);
           var diffByDays=  moment().diff(start,'days');
           $scope.restMonths = getRestDuration(ends);
           $scope.totalMonths = ends.diff(start,'months');
           var duration = ends.diff(start,'days');
          var percent = ((diffByDays/parseFloat(duration))*100);
        return percent;
    } ());
        $scope.options = {
            animate:{
                duration:0,
                enabled:false
            },
            barColor:function(percent) {
                percent /= 100;
                return "rgb(" + Math.round(255 * percent) + ", " + Math.round(255 * (1-percent)) + ", 0)";},
            scaleColor:false,
            lineWidth:20,
            lineCap:'circle'
        };

    if ($scope.project.ends != null) {
        $scope.projectEndsPlan = true;
        $scope.projectEnds = moment($scope.project.ends).format("DD/MM/YYYY");
    } else {
        $scope.projectEndsPlan = false;
    }

    $scope.startsTimeChosen = function () {
        $scope.projectStarts = moment($scope.tmpProject.starts).format("DD/MM/YYYY");
        $scope.tmpProject.ends = moment($scope.tmpProject.starts).add($scope.durationTime, 'months');
        $scope.projectEnds = moment($scope.tmpProject.ends).format("DD/MM/YYYY");
    }

    $scope.endsTimeChosen = function () {
        $scope.projectEnds = moment($scope.tmpProject.ends).format("DD/MM/YYYY");
        //calculate the diff on months
        var diff = moment($scope.tmpProject.ends).diff($scope.tmpProject.starts,'months');
        $scope.durationTime = diff;
    }

    $scope.editProject = function () {
        $scope.tmpProject = angular.copy($scope.project);
        $scope.durationTime = moment($scope.tmpProject.ends).diff($scope.tmpProject.starts,'months')
        $scope.allParticipantsToEdit = _remainingParticipants();
        $scope.allContributorsToEdit = _remainingContributors();
        $scope.projectStarts = moment($scope.project.starts).format("DD/MM/YYYY");
        if ($scope.project.ends != null) {
            $scope.projectEndsPlan = true;
            $scope.projectEnds = moment($scope.project.ends).format("DD/MM/YYYY");
        } else {
            $scope.projectEndsPlan = false;
        }
        $scope.isProjectEdit = true;
    }

    $scope.saveProject = function () {
        $scope.isUpdating = true;
        projectService.update({
            id: $scope.project.id,
            name: $scope.tmpProject.name,
            projectLeader: $scope.tmpProject.projectLeader.id,
            contributors: $scope.tmpProject.contributors,
            city: $scope.tmpProject.city,
            ends: $scope.tmpProject.ends,
            starts: moment($scope.tmpProject.starts).toDate(),
            customer: $scope.tmpProject.customer,
            participants: $scope.tmpProject.participants,
            address: $scope.tmpProject.address,
            duration : moment($scope.ends).diff($scope.starts,'days')
        }, function (data) {
            $scope.project = data;
            $scope.isUpdating = false;
            $scope.cancelEditProject();
            $state.reload();
        })
    }

    $scope.cancelEditProject = function () {
        $scope.tmpProject = {};
        $scope.updateProject.$setPristine();
        $scope.isProjectEdit = false;
    }

    $scope.contratDl = function () {
        if ($scope.project.status == 'new') {
            projectService.contractDownloaded($scope.project, function (result) {
                $scope.project.status = result.status;
            })
        }
    }

    $scope.contractUnsigned = function () {
        if ($scope.project.status == 'new' || $scope.project.status == 'Waiting for signing')
            return true;
        return false;
    }

    $scope.calculateTotalBudget = function (missions) {
        var total = 0;
        angular.forEach(missions, function (item, index) {
            total += item.budget;
        });
        return total;
    }

    /* HELPERS */

    /*$scope.$watch('projectEndsPlan', function (newVal, oldVal) {
        if (!newVal)
            $scope.tmpProject.ends = null;
        else {
            if ($scope.project.ends != null) {
                $scope.tmpProject.ends = angular.copy($scope.project.ends);
                $scope.projectEnds = moment($scope.tmpProject.ends).format("DD/MM/YYYY");
            } else {
                $scope.tmpProject.ends = moment().add(7, 'days');
                $scope.projectEnds = moment($scope.tmpProject.ends).format("DD/MM/YYYY");
            }
        }
    });*/

        $scope.$watch('durationTime', function (newVal, oldVal) {
            if (newVal && typeof newVal === 'number'){
                $scope.tmpProject.ends = moment($scope.tmpProject.starts).add(newVal, 'months');
            }else{
                $scope.tmpProject.ends = moment($scope.tmpProject.starts).add(oldVal, 'months');
            }
            $scope.projectEnds = moment($scope.tmpProject.ends).format("DD/MM/YYYY");

        });

    function _remainingParticipants() {
        var participantsAlreadyChosen = [];
        var remainingParticipants = [];
        var participantAlreadyChosenId = [];

        angular.forEach($scope.project.participants, function (item) {
            participantsAlreadyChosen.push(participantsAlreadyChosen, item)
        });
        angular.forEach(participantsAlreadyChosen, function (item) {
            participantAlreadyChosenId.push(item.id)
        });
        angular.forEach($scope.allParticipants, function (item) {
            if (participantAlreadyChosenId.indexOf(item.id) < 0) {
                remainingParticipants.push(item)
            }
        });
        return remainingParticipants;
    }

    $scope.removeFromParticipants = function ($item, $model) {
        $scope.allParticipantsToEdit.push($item);
    }

    $scope.addToParticipants = function ($item, $model) {
        $scope.allParticipantsToEdit.splice($scope.allParticipantsToEdit.indexOf($item), 1);
    }

    function _remainingContributors() {
        var contributorsAlreadyChosen = [];
        var remainingContributors = [];
        var contributorAlreadyChosenId = [];

        angular.forEach($scope.project.contributors, function (item) {
            contributorsAlreadyChosen.push(contributorsAlreadyChosen, item)
        });
        angular.forEach(contributorsAlreadyChosen, function (item) {
            contributorAlreadyChosenId.push(item.id)
        });
        angular.forEach($scope.allUsers, function (item) {
            if (contributorAlreadyChosenId.indexOf(item.id) < 0) {
                remainingContributors.push(item)
            }
        });
        return remainingContributors;
    }

    $scope.removeFromContributors = function ($item, $model) {
        $scope.allContributorsToEdit.push($item);
    }

    $scope.addToContributors = function ($item, $model) {
        $scope.allContributorsToEdit.splice($scope.allContributorsToEdit.indexOf($item), 1);
    }

    $scope.claculatePayed = function () {
        var total = 0;
        angular.forEach($scope.subprojects, function (subproject, index) {
            angular.forEach(subproject.bills, function (bill, index) {
                if (bill && !bill.isObsolete && bill.isPaid) {
                    total += bill.amount;
                }
            });
        });
        return total;
    }
    function getRestDuration(ends){
        var rest = ends.diff(moment(),'months');
        if(rest<0){
            rest = "+"+Math.abs(rest)+" Mois";
        }
        if(rest===0){
            rest = -ends.diff(moment(),'days')+" Jours";
        }
        if(rest>0){
            rest = "-"+rest+" Mois";
        }

       return rest;
    }

}]);