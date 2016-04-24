/**
 * Created by horri on 04/05/2015.
 */
app.controller('StatCtrl', ['$scope', '$compile', 'navService', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog', '$resource', 'projectService', 'notificationService', 'allProject', '$upload', '$timeout', 'subProjectService', 'numberToWordsService', 'subprojects', 'numberTruncatFilter', 'visits',
                    function ($scope, $compile, navService, DTOptionsBuilder, DTColumnDefBuilder, ngDialog, $resource, projectService, notificationService, allProject, $upload, $timeout, subProjectService, numberToWordsService, subprojects, numberTruncatFilter, visits) {

        $scope.projects = allProject;
        $scope.subprojects = subprojects;
        $scope.stats = [];
        $scope.tog = 1;
        $scope.startDate; // = moment().format("DD/MM/YYYY");
        $scope.endDate; //= moment().format("DD/MM/YYYY");
        $scope.statsByProjectLeader = [];
        $scope.statsByContributor = [];
        $scope.displayedCollection = [].concat($scope.stats);
        $scope.billingStats = [];
        $scope.isBillingStatsEmpty = true;
        $scope.indexShow = -1;
        $scope.projectsByLeader = [];
        $scope.projectsByContributor = [];
        $scope.totalVisits = 0;
        $scope.totalExamDoc = 0;
        $scope.totalBilled = 0;
        $scope.totalPaid = 0;
        $scope.ca = 0;
        $scope.totalProjects = $scope.projects.length;
        $scope.visits = visits;
        $scope.statsByVisitsCollection = [];
        $scope.visitsByStatus = [];
        $scope.totalNewVisits = 0;
        $scope.totalProcessVisits = 0;
        $scope.totalClosedVisits = 0;
        $scope.visitsByContributor = [];
        $scope.dataVisitsByContributor = [];


        $scope.resetTime = function () {
            $scope.startDate = ($scope.startDate) ? moment($scope.startDate).format("YYYY-MM-DD") : undefined;
            $scope.endDate = ($scope.endDate) ? moment($scope.endDate).format("YYYY-MM-DD") : undefined;
            $scope.startDate = ($scope.startDate === 'Invalid date') ? undefined : $scope.startDate;
            $scope.endDate = ($scope.endDate === 'Invalid date') ? undefined : $scope.endDate;
            if (!$scope.startDate && !$scope.endDate) {
                _reset();
                $scope.projects.map(function (project) {
                    $scope.stats.push(generateStatistic(project, $scope.subprojects));
                });
                _updateOdometers();

            }
            if ($scope.startDate && !$scope.endDate) {
                $scope.startsTimeChosen($scope.startDate);
            }
            if ($scope.endDate) {
                $scope.endsTimeChosen($scope.endDate);
            }


        };

        function _reset() {
            $scope.displayedCollection = [];
            $scope.stats = [];
            $scope.totalVisits = 0;
            $scope.totalExamDoc = 0;
            $scope.ca = 0;
            $scope.totalBilled = 0;
            $scope.totalPaid = 0;

        }

        $scope.startsTimeChosen = function (newDate) {
            $scope.startDate = moment(newDate).format("YYYY-MM-DD");
            _reset();
            moment.locale('Fr-fr');
            var start = moment(newDate).format("YYYY-MM-DD");
            $scope.projects.map(function (project) {
                var that = this;
                var projectDate = moment(new Date(project.starts)).format("YYYY-MM-DD");
                var result = moment(projectDate).isAfter(start);
                if (result) {
                    that.push(generateStatistic(project, $scope.subprojects));
                }
            }, $scope.stats);

            _updateOdometers();
        }

        function _updateOdometers() {
            var el = document.querySelector('span.odo-affairs');
            var od = new Odometer({
                el: el
            });
            od.update($scope.stats.length);
            el = document.querySelector('span.odo-exam');
            od = new Odometer({
                el: el
            });
            od.update($scope.totalExamDoc);
            el = document.querySelector('span.odo-visit');
            od = new Odometer({
                el: el
            });
            od.update($scope.totalVisits);

            el = document.querySelector('span.odo-ca');
            od = new Odometer({
                el: el
            });
            var val = numberTruncatFilter($scope.ca);
            od.update(val);
            el = document.querySelector('span.odo-paid');
            od = new Odometer({
                el: el
            });
            var val = numberTruncatFilter($scope.totalPaid);
            od.update(val);
            el = document.querySelector('span.odo-billed');
            od = new Odometer({
                el: el
            });
            var val = numberTruncatFilter($scope.totalBilled);
            od.update(val);
        }

        $scope.endsTimeChosen = function (newDate) {
            $scope.endDate = moment(newDate).format("YYYY-MM-DD");
            _reset();
            moment.locale('Fr-fr');
            var end = moment(newDate).format("YYYY-MM-DD");
            var start = ($scope.startDate !== undefined) ? moment($scope.startDate, "YYYY-MM-DD").format("YYYY-MM-DD") : undefined;
            for (id = 0; id < $scope.projects.length; id++) {
                var project = $scope.projects[id];
                var projectDate = moment(new Date(project.starts)).format("YYYY-MM-DD");
                var result = false;
                if (start === undefined) {
                    result = moment(projectDate).isBefore(end);
                } else {
                    result = moment(projectDate).isAfter(start) && moment(projectDate).isBefore(end);
                }
                if (result) {
                    $scope.stats.push(generateStatistic($scope.projects[id], $scope.subprojects));
                }

            }
            _updateOdometers();
        }


        for (id = 0; id < $scope.projects.length; id++) {

            $scope.stats.push(generateStatistic($scope.projects[id], $scope.subprojects));

        }

        function generateStatistic(project, subprojects) {

            var totalBilling = 0;
            var totalPaid = 0;
            var budget = 0;
            subprojects.map(function (subProject) {
                if (project.id == subProject.project.id) {
                    budget += subProject.budget;
                    subProject.bills.forEach(function (bill, i, arr) {
                        totalBilling += bill.amount;
                        if (bill.isPaid)
                            totalPaid += bill.amount;
                    });
                }
            });
            /*for(i=0;i<subprojects.length;i++){
                var subProject = subprojects[i];
                if(project.id==subProject.project.id){
                    budget += subProject.budget;
                    subProject.bills.forEach(function (bill, i, arr) {
                        totalBilling += bill.amount;
                        if (bill.isPaid)
                            totalPaid += bill.amount;
                    });
                }
            }*/

            var totalVisits = getVisitsCount(project.activities);
            var totalExamDoc = getDocExamsCount(project.docExaminations);

            $scope.ca += budget;
            $scope.totalVisits += totalVisits;
            $scope.totalExamDoc += totalExamDoc;
            $scope.totalBilled += totalBilling;
            $scope.totalPaid += totalPaid;
            return {
                "id": project.id,
                "ref": project.ref,
                "name": project.name,
                "projectLeader": project.projectLeader,
                "date": project.starts,
                "nbrDocExam": totalExamDoc,
                "nbrVisits": totalVisits,
                "budget": budget,
                "totalBilling": totalBilling,
                "totalPaid": totalPaid
            }
        }


        $scope.displayStatsByProject = function () {
            $scope.tog = 1;
            $scope.statsByProjectLeaderCollection = [];

        }
        $scope.displayStatsByProjectLeader = function () {
            $scope.tog = 2;
            $scope.showDetails = false;
            generateStatisticByProjectLeader();
            $scope.statsByProjectLeaderCollection = [].concat($scope.statsByProjectLeader);
        }
        $scope.displayStatsByContributors = function () {
            $scope.tog = 3;
            generateStatisticByContributor();
            $scope.statsByContributorCollection = [].concat($scope.statsByContributor);
        }
        $scope.displayStatsByBilling = function () {
            $scope.tog = 4;
            generateBillingStats();
            $scope.isBillingStatsEmpty = ($scope.billingStats.length > 0);
            $scope.billingStatsCollection = [].concat($scope.billingStats);

        }


        function generateBillingStats() {
            $scope.billingStats = [];
            for (var i = 0; i < $scope.subprojects.length; i++) {
                var sp = $scope.subprojects[i];
                var id = sp.project.id;
                if (sp.project.isDeleted) {
                    continue;
                }
                var projectArray = $scope.projects.filter(function (e) {
                    return e.id == id;
                });
                var project = projectArray[0];

                var customer = project.customer.company;
                for (var j = 0; j < sp.bills.length; j++) {
                    var bill = sp.bills[j];
                    $scope.billingStats.push({
                        "id": sp.id,
                        "title": bill.title,
                        "createdAt": bill.createdAt,
                        "project": project,
                        "customer": customer,
                        "isPaid": bill.isPaid
                    });
                }
            }
        }

        function generateStatisticByProjectLeader() {
            $scope.statsByProjectLeader = [];
            for (id = 0; id < $scope.projects.length; id++) {
                var project = $scope.projects[id];
                var docExams = getDocExamsCountByContributor(project, project.projectLeader);
                var visits = getVisitsCountByContributor(project, project.projectLeader);
                console.log(project.name);
                console.log(project.projectLeader.name);
                if ($scope.statsByProjectLeader.length == 0) {
                    $scope.statsByProjectLeader.push({
                        "id": project.projectLeader.id,
                        "projectLeader": project.projectLeader,
                        "projects": 1,
                        "docExamsCount": docExams,
                        "visitsCount": visits
                    });
                } else {
                    var object = $scope.statsByProjectLeader.filter(function (e) {
                        return e.id == project.projectLeader.id;
                    });
                    var statsObject = object[0];

                    var stats = $scope.statsByProjectLeader.filter(function (e) {
                        return e.id != project.projectLeader.id;
                    });
                    // Add new element
                    if (typeof statsObject === 'undefined') {
                        stats.push({
                            "id": project.projectLeader.id,
                            "projectLeader": project.projectLeader,
                            "projects": 1,
                            "docExamsCount": docExams,
                            "visitsCount": visits
                        })
                    } else {
                        // update existing element
                        stats.push({
                            "id": statsObject.id,
                            "projectLeader": statsObject.projectLeader,
                            "projects": statsObject.projects + 1,
                            "docExamsCount": statsObject.docExamsCount + docExams,
                            "visitsCount": statsObject.visitsCount + visits
                        });



                    }
                    $scope.statsByProjectLeader = stats;

                }


            }
            //}
        }


        function generateStatisticByContributor() {
            $scope.statsByContributor = [];
            var i;

            for (var id = 0; id < $scope.projects.length; id++) {
                var project = $scope.projects[id];
                if ($scope.statsByContributor.length === 0) {
                    // add new elements
                    for (jd = 0; jd < project.contributors.length; jd++) {
                        var contributor = project.contributors[jd];
                        var docExams = getDocExamsCountByContributor(project, contributor);
                        var visits = getVisitsCountByContributor(project, contributor);
                        $scope.statsByContributor.push({
                            "id": contributor.id,
                            "name": contributor.name,
                            "projects": 1,
                            "docExamsCount": docExams,
                            "visitsCount": visits
                        });
                    }
                } else {
                    for (jj = 0; jj < project.contributors.length; jj++) {
                        var contributor = project.contributors[jj];
                        var docExams = getDocExamsCountByContributor(project, contributor);
                        var visits = getVisitsCountByContributor(project, contributor);
                        var object = $scope.statsByContributor.filter(function (e) {
                            return e.id == contributor.id;
                        });
                        var statsObject = object[0];

                        var stats = $scope.statsByContributor.filter(function (e) {
                            return e.id != contributor.id;
                        });
                        // Add new element
                        if (typeof statsObject === 'undefined') {
                            stats.push({
                                "id": contributor.id,
                                "name": contributor.name,
                                "projects": 1,
                                "docExamsCount": docExams,
                                "visitsCount": visits
                            })
                        } else {
                            // update existing element
                            stats.push({
                                "id": statsObject.id,
                                "name": statsObject.name,
                                "projects": statsObject.projects + 1,
                                "docExamsCount": statsObject.docExamsCount + docExams,
                                "visitsCount": statsObject.visitsCount + visits
                            });


                        }
                        $scope.statsByContributor = stats;
                    }

                }


            }
            //}
        }

        function getDocExamsCountByContributor(project, contributor) {
            var count = 0;
            return project.docExaminations.reduce(function (prev, curr, index) {
                if (curr.isDeleted === false && curr.contributor === contributor.id) {
                    count++;
                }
                return count;
            }, 0);

        }

        function getVisitsCountByContributor(project, contributor) {
            var count = 0;
            return project.activities.reduce(function (prev, curr, index) {
                if (curr.isDeleted === false && curr.contributor === contributor.id) {
                    count++;
                }
                return count;
            }, 0);


        }

        function getDocExamsCount(docExaminations) {
            var count = 0;
            return docExaminations.reduce(function (prev, curr, index) {
                if (curr.isDeleted === false) {
                    count++;
                }
                return count;
            }, 0);
        }

        function getVisitsCount(activities) {
            var count = 0;
            return activities.reduce(function (prev, curr, index) {
                if (curr.isDeleted === false) {
                    count++;
                }
                return count;
            }, 0);
        }

        $scope.billingDetails = function (project, $index) {
            $scope.indexMissionsShowing = $index;
            $scope.projectSelected = project;
            $scope.notBilled = project.budget - project.totalBilling;
            $scope.notPaid = project.budget - project.totalPaid

            ngDialog.open({
                template: 'billingDetailModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: false,
                className: 'ngdialog-theme-default ngdialog-big'
            });
            $scope.indexMissionsShowing = null;

        }

        $scope.isShowingMissions = function (index) {
            if ($scope.indexMissionsShowing == index)
                return true;
            else return false;

        };

        $scope.closeModal = function () {
            ngDialog.closeAll();
        };
        $scope.displayDetails = function (projectLeader, showDetails) {
            if (!showDetails)
                return;
            $scope.projectsByLeader = [];
            for (j = 0; j < $scope.projects.length; j++) {
                var project = $scope.projects[j];
                var budget = 0;
                for (i = 0; i < $scope.subprojects.length; i++) {
                    var subProject = subprojects[i];
                    if (project.id == subProject.project.id) {
                        budget += subProject.budget;
                    }
                }
                project.budget = budget;
                if (project.projectLeader.id === projectLeader.id) {
                    console.log(project.starts);
                    $scope.projectsByLeader.push(project)
                }
            }
        }
        $scope.displayProjectsDetails = function (contributor, showProjectsDetails) {
                if (!showProjectsDetails)
                    return;
                $scope.projectsByContributor = [];
                $scope.projects.map(function (project) {
                    var that = this;
                    project.contributors.map(function (contributorArg) {
                        var t = this;
                        if (contributor === contributorArg.id) {
                            t.push(project);
                        }
                    }, that);
                }, $scope.projectsByContributor);
            }
            // ************************************
            // Display all stats related to visits
            // ************************************
        $scope.displayStatsByVisits = function () {
            $scope.tog = 5;
            $scope.statsByVisitsCollection = [];
            $scope.visitsByStatus = [];
            $scope.totalNewVisits = 0;
            $scope.totalProcessVisits = 0;
            $scope.totalClosedVisits = 0;

            getVisitsByStatus();
            $scope.statsByVisitsCollection = [].concat($scope.visitsByStatus);
            calculateTotalsVisits();
            $scope.chartData = [{
                "data1": 10,
                "data2": 20
            }, {
                "data1": 50,
                "data2": 60
            }];
            $scope.chartColumns = [{
                    "id": "data1",
                    "type": "pie"
                }, {
                    "id": "data2",
                    "type": "pie"
                }]
                // $scope.donnee = [{"Nouveau": 10,"En cours": 20,"Clôturé": 70}];
                /*(function(){

            var  percentNew, percentPrecess, percentClosed;
            var totalVisits = $scope.totalNewVisits + $scope.totalProcessVisits + $scope.totalClosedVisits;
            percentNew = ($scope.totalNewVisits/parseFloat(totalVisits))*100;
            percentPrecess = ($scope.totalProcessVisits/parseFloat(totalVisits))*100;
            percentClosed = ($scope.totalClosedVisits/parseFloat(totalVisits))*100;
            return  [{"Nouveau": percentNew,"En cours": percentPrecess,"Clôturé": percentClosed}];
        }());*/
                //$scope.columns = [{"id": "Nouveau", "type": "donut"}, {"id": "En cours", "type": "donut"}, {"id": "Clôturé", "type": "donut"}];
                //$scope.visitsPartitionByContributor = [{"BENNAN": 80,"NQAIRI REDOUANE": 20}];
                /*(function(){
                    var result = {},percentByContributor;
                    $scope.visitsByStatus.forEach(function(value){
                        percentByContributor = ((value.newVisits + value.processVisits+value.closedVisits)/parseFloat($scope.totalNewVisits + $scope.totalProcessVisits + $scope.totalClosedVisits)) *100;
                        result[value.contributor.name] = percentByContributor;
                    });
                    return [result];
                })();*/
                // $scope.columsByContributor = [{"id": "BENNAN", "type": "pie"}, {"id": "NQAIRI REDOUANE", "type": "pie"}];

        }


        function getVisitsByStatus(visits) {
            var statsVisits = {};
            $scope.visits.forEach(function (obj) {
                if (!(obj.contributor.id in statsVisits)) {

                    statsVisits[obj.contributor.id] = {
                        contributor: (typeof obj.contributor === 'undefined') ? {
                            name: 'Inconnu'
                        } : obj.contributor,
                        newVisits: (obj.status === 'Nouveau') ? 1 : 0,
                        processVisits: (obj.status === 'En cours') ? 1 : 0,
                        closedVisits: (obj.status === 'Clôturé') ? 1 : 0
                    }
                    $scope.visitsByStatus.push(statsVisits[obj.contributor.id])
                } else {
                    statsVisits[obj.contributor.id].newVisits += (obj.status === 'Nouveau') ? 1 : 0;
                    statsVisits[obj.contributor.id].processVisits += (obj.status === 'En cours') ? 1 : 0;
                    statsVisits[obj.contributor.id].closedVisits += (obj.status === 'Clôturé') ? 1 : 0;
                }
            });

        }

        function calculateTotalsVisits() {
            $scope.visitsByStatus.forEach(function (o) {

                $scope.totalNewVisits += o.newVisits;
                $scope.totalProcessVisits += o.processVisits;
                $scope.totalClosedVisits += o.closedVisits;
            });
            _updateVisitsOdometers();
        }

        function _updateVisitsOdometers() {
            var el = document.querySelector('span.odo-new');
            var od = new Odometer({
                el: el
            });
            od.update($scope.totalNewVisits);

            var el = document.querySelector('span.odo-processing');
            var od = new Odometer({
                el: el
            });
            od.update($scope.totalProcessVisits);

            var el = document.querySelector('span.odo-closed');
            var od = new Odometer({
                el: el
            });
            od.update($scope.totalClosedVisits);
        }

        $scope.showVisitDialogModal = function (status, contributor) {

                var vStatus = 'Nouveau';
                if (status === 'process') {
                    vStatus = 'En cours'
                }
                if (status === 'closed') {
                    vStatus = 'Clôturé'
                }
                var visits = $scope.visits.filter(function (visit) {
                    return (visit.status === vStatus && visit.contributor.id === contributor.id);
                });
                $scope.projectsByVisitsStatus = visits.map(function (v) {
                    return v.project;
                });

                $scope.projectsByVisitsStatusCollection = [].concat($scope.projectsByVisitsStatus);

                ngDialog.open({
                    template: 'visitDialogModal',
                    scope: $scope,
                    showClose: true,
                    closeByDocument: false,
                    closeByEscape: false,
                    className: 'ngdialog-theme-default ngdialog-big'
                });


            }
            /*
             * filter visits and apply related function
             */
        $scope.$watch('startDate', function () {
            if ($scope.tog === 5) {
                var visits = $scope.visits.filter(function (visit) {
                    var d = moment(visit.date);
                    var start = moment('2000-01-01');
                    var end = moment();
                    if ($scope.startDate) {
                        start = moment($scope.startDate);
                    }
                    if ($scope.endDate) {
                        end = moment($scope.endDate)
                    }
                    return (d.isAfter(start) && d.isBefore(end));
                });
                $scope.visits = visits;
                $scope.displayStatsByVisits();
            }
        });

        $scope.$watch('endDate', function () {
            if ($scope.tog === 5) {
                var visits = $scope.visits.filter(function (visit) {
                    var d = moment(visit.date);
                    var start = moment('2000-01-01');
                    var end = moment();
                    if ($scope.startDate) {
                        start = moment($scope.startDate);
                    }
                    if ($scope.endDate) {
                        end = moment($scope.endDate)
                    }
                    return (d.isAfter(start) && d.isBefore(end));
                });
                $scope.visits = visits;
                $scope.displayStatsByVisits();
            }
        });
                        
        $scope.sayHello = function(){
            return "Hello World";
        };

}]);