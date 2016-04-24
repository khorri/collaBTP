// ADD PROJECT CONTROLLER

app.controller('addProjectCtrl', ['$scope', 'navService', '$sails', 'projectService', 'allUsers', 'allDirectersEngineers', 'allParticipants', 'allCustomers', 'allMissions', 'allPaymentMethods', 'allTypes', '$state', 'moment', 'notificationService', 'customerService', 'participantService', 'ngDialog', '$upload', 'loggedUser',
    function ($scope, navService, $sails, projectService, allUsers, allDirectersEngineers, allParticipants, allCustomers, allMissions, allPaymentMethods, allTypes, $state, moment, notificationService, customerService, participantService, ngDialog, $upload, loggedUser) {

        $scope.isCreating = false;
        $scope.isCreatingNewCustomer = false;
        $scope.isCreatingNewParticipant = false;
        $scope.project = {};
        $scope.newCustomerOpen = false;
        $scope.newParticipantOpen = false;
        $scope.newCustomer = {};
        $scope.newParticipant = {};
        $scope.allDirectersEngineers = allDirectersEngineers;
        $scope.allUsers = allUsers;
        $scope.allTypes = allTypes;
        $scope.allParticipants = allParticipants;
        $scope.allCustomers = allCustomers;
        $scope.allMissions = allMissions;
        $scope.allPaymentMethods = allPaymentMethods;
        $scope.starts = moment();
        $scope.ends = moment($scope.starts).add(1, 'months');
        $scope.projectStarts = moment($scope.starts).format("DD/MM/YYYY");
        $scope.projectEnds = moment($scope.ends).format("DD/MM/YYYY");
        $scope.projectEndsPlan = false;
        $scope.paymentmethods = [{
            percentage: 0,
            label: ''
        }];
        $scope.durationTime = 1;
        $scope.documents = [];
        $scope.newDocument = {};

        $scope.startsTimeChosen = function () {
            $scope.projectStarts = moment($scope.starts).format("DD/MM/YYYY");
            $scope.ends = moment($scope.starts).add($scope.durationTime, 'months');
            $scope.projectEnds = moment($scope.ends).format("DD/MM/YYYY");
        }

        $scope.endsTimeChosen = function () {
            $scope.projectEnds = moment($scope.ends).format("DD/MM/YYYY");
            //calculate the diff on months
            var diff = moment($scope.ends).diff($scope.starts, 'months');
            $scope.durationTime = diff;
        }

        $scope.$watch('durationTime', function (newVal, oldVal) {
            if (newVal && typeof newVal === 'number') {
                $scope.ends = moment($scope.start).add(newVal, 'months');
            } else {
                $scope.ends = moment($scope.start).add(oldVal, 'months');
            }
            $scope.projectEnds = moment($scope.ends).format("DD/MM/YYYY");

        });

        $scope.createProject = function () {
            $scope.isCreating = true;

            projectService.add({
                name: $scope.projectName,
                projectLeader: $scope.project.projectLeader,
                missions: $scope.project.missions,
                customer: $scope.project.customer,
                starts: moment($scope.starts).toDate(),
                ends: $scope.ends,
                contributors: $scope.project.contributors,
                participants: $scope.project.participants,
                paymentMethods: $scope.paymentmethods,
                budget: $scope.budget,
                address: $scope.address,
                city: $scope.city,
                duration: moment($scope.ends).diff($scope.starts, 'days'),
                documents: $scope.documents
            }, function () {
                notificationService.notify({
                    title: 'Projet créé',
                    text: 'Le projet "' + $scope.projectName + '" a été crée',
                    icon: 'fa fa-plus',
                    type: 'success',
                    animate_speed: 'fast',
                });
                $scope.isCreating = false;
                $state.go('home');
            })
        }

        $scope.addPm = function () {
            $scope.paymentmethods.push({
                percentage: 0,
                label: ''
            });
        }

        $scope.removePm = function (index) {
            $scope.paymentmethods.splice(index, 1);
        }

        $scope.budgetPercentage = function (index) {
            var num = 0.01 * $scope.paymentmethods[index].percentage * $scope.budget;
            return Math.round(num * 100) / 100;
        }

        $scope.nextBarType = function (index) {
            if (index == 0) {
                return "success";
            } else if (index % 2 == 0)
                return "success";
            else
                return "default";
        }
        $scope.max = 0;

        $scope.checkTotal = function () {
            var total = 0;
            for (var i = 0; i < $scope.paymentmethods.length; i++) {
                var val = $scope.paymentmethods[i].percentage;
                total += val;
            }
            $scope.total = total;
        }

        $scope.$watch('total', function () {
            $scope.max = 100 - $scope.total;

            if ($scope.max < 0)
                $scope.max = -1;
        });

        $scope.cancelCustCreation = function () {
            $scope.newCustomerOpen = false;
            $scope.newCustomer = {};
        }

        $scope.openAddCustomerModal = function () {
            $scope.closeModal();
            ngDialog.open({
                template: 'addCustomerModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: true,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }

        $scope.createCustomer = function () {
            $scope.isCreatingNewCustomer = true;
            customerService.add({
                contactPerson: $scope.newCustomer.contactPerson,
                phone: $scope.newCustomer.phone,
                email: $scope.newCustomer.email,
                company: $scope.newCustomer.company,
                cellphone: $scope.newCustomer.cellphone,
                address: $scope.newCustomer.address,
                type: $scope.newCustomer.type.id,
            }, function (data) {
                $scope.newCustomerOpen = false;
                $scope.allCustomers.push(data);
                $scope.project.customer = data;
                $scope.closeModal();
                $scope.isCreatingNewCustomer = false;
                $scope.newCustomer = {};
            })
        }
        $scope.cancelParticipantCreation = function () {
            $scope.newParticipantOpen = false;
            $scope.newParticipant = {};
        }

        $scope.openAddParticipantModal = function () {
            $scope.closeModal();
            ngDialog.open({
                template: 'addParticipantModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: true,
                className: 'ngdialog-theme-default ngdialog-big'
            });
        }

        $scope.createParticipant = function () {
            $scope.isCreatingNewParticipant = true;
            participantService.add({
                contactPerson: $scope.newParticipant.contactPerson,
                phone: $scope.newParticipant.phone,
                email: $scope.newParticipant.email,
                company: $scope.newParticipant.company,
                cellphone: $scope.newParticipant.cellphone,
                address: $scope.newParticipant.address,
                type: $scope.newParticipant.type.id,
            }, function (data) {
                $scope.newParticipantOpen = false;
                $scope.allParticipants.push(data);
                $scope.closeModal();
                $scope.isCreatingNewParticipant = false;
                $scope.newParticipant = {};
            })
        }

        $scope.closeModal = function () {
            ngDialog.closeAll();
        }

        //Upload a document

        $scope.$watch('files', function () {
            if ($scope.files != null) {
                $scope.upload($scope.files[0]);
            }
        });

        $scope.upload = function (file) {
            if (file) {
                $upload.upload({
                    url: '/file/uploadDocument',
                    fileFormDataName: 'doc',
                    file: file,
                    fields: {
                        fileName: $scope.fileName,
                        description: $scope.fileDescription
                    }
                }).progress(function (evt) {
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    console.log(data);

                    data.isUploaded = true;
                    $scope.newDocument = data;
                    $scope.newDocument.ext = file.name.split(".").pop();
                    $scope.files = [];
                });
            }
        };
        $scope.addDocument = function () {
            if ($scope.currentDocument) {
                updateDocument();
            } else {
                insertDocument();
            }

            $scope.newDocument = {};
            delete $scope.fileName;
            delete $scope.fileDescription;
            delete $scope.currentDocument;
        }

        // Delete a document
        $scope.openDeleteDocModal = function (document) {
            $scope.currentDocument = document;
            ngDialog.open({
                template: 'DeleteDocModal',
                scope: $scope,
                showClose: true,
                closeByDocument: false,
                closeByEscape: true,
                className: 'ngdialog-theme-default ngdialog-small'
            });
        }
        $scope.deleteDocument = function (doc) {

            var i = $scope.documents.indexOf(doc);
            //if is already uploaded then delete it from the server
            $scope.documents.splice(i, 1);
        }

        $scope.cancelAddingDocument = function () {
            $scope.newDocument = {};
            delete $scope.fileName;
            delete $scope.fileDescription;

        }

        $scope.editDocument = function (doc) {
            $scope.fileName = doc.name;
            $scope.fileDescription = doc.description;
            $scope.currentDocument = doc;
        }
        var updateDocument = function () {
            var i = $scope.documents.indexOf($scope.currentDocument);
            //if is already uploaded then delete it from the server
            if ($scope.newDocument.isUploaded) {
                $scope.newDocument.createdBy = loggedUser.data;
                $scope.documents[i] = $scope.newDocument;
            } else {
                if (!$scope.fileName)
                    return;
                $scope.documents[i] = ({
                    name: $scope.fileName,
                    description: $scope.fileDescription,
                    createdAt: new Date(),
                    createdBy: loggedUser.data,
                    ext: 'vide'
                });

            }

        }

        var insertDocument = function () {
            if ($scope.newDocument.isUploaded) {
                $scope.newDocument.createdBy = loggedUser.data;
                $scope.documents.push($scope.newDocument);
            } else {
                if (!$scope.fileName)
                    return;
                $scope.documents.push({
                    name: $scope.fileName,
                    description: $scope.fileDescription,
                    createdAt: new Date(),
                    createdBy: loggedUser.data,
                    ext: 'vide'
                });

            }
        }

    }]);