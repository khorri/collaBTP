app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $urlRouterProvider.when('/project/:id', '/project/:id/details');
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "app/partials/home.html",
            controller: 'homeCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'home';
                }],
                allProject: ['projectResource', function (projectResource) {
                    return projectResource.query().$promise;
                }]
            },
            ncyBreadcrumb: {
                label: 'Tableau de bord'
            }
        })
        .state('admin', {
            url: "/admin",
            templateUrl: "app/partials/admin.html",
            controller: 'adminCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'Administration';
                }]
            },
            ncyBreadcrumb: {
                label: 'Administration'
            }
        })
        .state('stats', {
            url: "/stats",
            templateUrl: "app/partials/statistics/statistic.html",
            controller: 'StatCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'stats';
                }],
                allProject: ['projectResource', function (projectResource) {
                    return projectResource.query().$promise;
                }],
                subprojects: ['subProjectResource', function (subProjectResource) {
                    return subProjectResource.query().$promise;
                }],
                visits: ['visitsResource', function (visitsResource) {
                    return visitsResource.query().$promise;
                }]
            },
            ncyBreadcrumb: {
                label: 'Statistiques'
            }
        })
        .state('myprofil', {
            url: "/myprofil",
            templateUrl: "app/partials/profil.html",
            controller: 'profilCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'profil';
                }]
            },
            ncyBreadcrumb: {
                label: 'Mon profil'
            }
        })
        .state('addproject', {
            url: "/addproject",
            templateUrl: "app/partials/addProject.html",
            controller: 'addProjectCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'Ajouter un nouveau projet';
                }],
                allUsers: ['usersResource', function (usersResource) {
                    return usersResource.query().$promise;
                }],
                allDirectersEngineers: ['dirEngResource', function (dirEngResource) {
                    return dirEngResource.query().$promise;
                }],
                allCustomers: ['customersResource', function (customersResource) {
                    return customersResource.query().$promise;
                }],
                allParticipants: ['participantsResource', function (participantsResource) {
                    return participantsResource.query().$promise;
                }],
                allMissions: ['missionsResource', function (missionsResource) {
                    return missionsResource.query().$promise;
                }],
                allPaymentMethods: ['paymentMethodsResource', function (paymentMethodsResource) {
                    return paymentMethodsResource.query().$promise;
                }],
                allTypes: ['typeResource', function (typeResource) {
                    return typeResource.query().$promise;
                }],
                loggedUser: ['$http', function ($http) {
                    return $http.get('/user/loggedUser', {
                        cache: true
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Ajouter un projet'
            }
        })
        .state('project', {
            url: "/project/:id",
            templateUrl: "app/partials/project.html",
            controller: 'projectCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'Gestion du projet';
                }],
                allParticipants: ['participantsResource', function (participantsResource) {
                    return participantsResource.query().$promise;
                }],
                allDirectersEngineers: ['dirEngResource', function (dirEngResource) {
                    return dirEngResource.query().$promise;
                }],
                allUsers: ['usersResource', function (usersResource) {
                    return usersResource.query().$promise;
                }],
                allCustomers: ['customersResource', function (customersResource) {
                    return customersResource.query().$promise;
                }],
                project: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/project/getbyid', {
                        id: projectId
                    }, {
                        cache: true
                    });
                }],
                subProjects: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/subproject/getByProject', {
                        id: projectId
                    }, {
                        cache: true
                    });
                }],
                allMissions: ['missionsResource', function (missionsResource) {
                    return missionsResource.query().$promise;
                }],
                loggedUser: ['$http', function ($http) {
                    return $http.get('/user/loggedUser', {
                        cache: true
                    });
                }]
            },
            ncyBreadcrumb: {
                label: '{{project.name | truncate: 30: "..." | ucfirst}}'
            }
        })
        .state('project.details', {
            url: "/details",
            templateUrl: "app/partials/projectTabs/detailsTab.html",
            controller: 'detailsCtrl',
            resolve: {
                subProjects: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/subproject/getByProject', {
                        id: projectId
                    }, {
                        cache: true
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Détails'
            }
        })
        .state('project.tasks', {
            url: "/tasks",
            templateUrl: "app/partials/projectTabs/tasksTab.html",
            controller: 'tasksCtrl',
            ncyBreadcrumb: {
                label: 'Tâches'
            }
        })
        .state('project.files', {
            url: "/files",
            templateUrl: "app/partials/projectTabs/filesTab.html",
            controller: 'fileCtrl',
            resolve: {
                documents: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/file/getByProject', {
                        project: $stateParams.id
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Documents'
            }
        })
        .state('project.plans', {
            url: "/plans",
            templateUrl: "app/partials/projectTabs/planTab.html",
            controller: 'planCtrl',
            resolve: {
                plans: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/plan/getByProject', {
                        project: $stateParams.id
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Plans'
            }
        })
    .state('addplan', {
            url: "/project/:id/addplan",
            templateUrl: "app/partials/projectTabs/addplan.html",
            controller: 'planCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'Ajouter un nouveau plan';
                }],
                project: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/project/getbyid', {
                        id: projectId
                    }, {
                        cache: true
                    });
                }],
                plans: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/plan/getByProject', {
                        project: $stateParams.id
                    });
                }],
            },
            ncyBreadcrumb: {
                label: 'Ajouter un plan'
            }
        })
        .state('project.messages', {
            url: "/messages",
            templateUrl: "app/partials/projectTabs/messageTab.html",
            controller: 'MessageCtrl',
            ncyBreadcrumb: {
                label: 'Message'
            }
        })
        .state('project.docExam', {
            url: "/docExam",
            templateUrl: "app/partials/projectTabs/docExamTab.html",
            controller: 'docExamCtrl',
            resolve: {
                docExaminations: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/docExamination/getAllByProject', {
                        id: $stateParams.id
                    }, {
                        cache: true
                    });
                }],
                subProjects: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/subproject/getByProject', {
                        id: projectId
                    }, {
                        cache: true
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Examination de document'
            }
        }).state('project.descriptionFile', {
            url: "/descriptionFile",
            templateUrl: "app/partials/projectTabs/descriptionFileTab.html",
            controller: 'descriptionFileCtrl',
            ncyBreadcrumb: {
                label: 'Fiche descriptive'
            }
        }).state('project.fieldVisit', {
            url: "/fieldVisit",
            abstract: true,
            template: '<ui-view/>',
            ncyBreadcrumb: {
                label: 'Visites de chantier'
            }
        }).state('project.fieldVisit.all', {
            url: "",
            templateUrl: "app/partials/projectTabs/fieldVisitTab.html",
            controller: 'fieldVisitCtrl',
            resolve: {
                activities: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/activity/getAllByProject', {
                        id: $stateParams.id
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Visites de chantier'
            }
        }).state('project.fieldVisit.attachedFiles', {
            url: "/attachedFiles/:aId",
            templateUrl: "app/partials/projectTabs/fvAttachedFiles.html",
            controller: 'fvAttachedFilesCtrl',
            resolve: {
                activity: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/activity/getById', {
                        id: $stateParams.aId
                    });
                }],
                attachedFiles: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/activity/getAttachedFiles', {
                        id: $stateParams.aId
                    });
                }]
            },
            ncyBreadcrumb: {
                parent: 'project.fieldVisit.all',
                label: 'Fichiers attachés'
            }
        }).state('project.missions', {
            url: "/missions",
            abstract: true,
            template: '<ui-view/>',
            ncyBreadcrumb: {
                label: 'Missions'
            }
        }).state('project.missions.details', {
            url: '',
            templateUrl: "app/partials/projectTabs/subProjectTab.html",
            controller: 'missionsCtrl',
            resolve: {
                subProjects: ['$http', '$stateParams', function ($http, $stateParams) {
                    var projectId = $stateParams.id;
                    return $http.post('/subproject/getByProject', {
                        id: projectId
                    });
                }]
            },
            ncyBreadcrumb: {
                label: 'Liste des missions'
            }
        }).state('project.missions.facturation', {
            url: "/facturation/:sId",
            templateUrl: "app/partials/projectTabs/facturationTab.html",
            controller: 'facturationCtrl',
            resolve: {
                subProject: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/subProject/getById', {
                        id: $stateParams.sId
                    });
                }],
                paymentMethods: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/paymentMethod/getBySubProject', {
                        subproject: $stateParams.sId
                    });
                }]
            },
            ncyBreadcrumb: {
                parent: 'project.missions.details',
                label: 'Facturation'
            }
        }).state('project.missions.invoicelist', {
            url: "/invoicelist/:sId",
            templateUrl: "app/partials/projectTabs/invoicelistTab.html",
            controller: 'invoicelistCtrl',
            resolve: {
                subProject: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/subProject/getById', {
                        id: $stateParams.sId
                    });
                }],
                bills: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/bill/getBySubProject', {
                        id: $stateParams.sId
                    });
                }]
            },
            ncyBreadcrumb: {
                parent: 'project.missions.facturation',
                label: 'Liste de factures'
            }
        }).state('project.missions.voir', {
            url: "/voir/:sId",
            templateUrl: "app/partials/projectTabs/showSubproject.html",
            controller: 'showSubprojectCtrl',
            resolve: {
                subProject: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/subProject/getById', {
                        id: $stateParams.sId
                    });
                }],
                paymentMethods: ['$http', '$stateParams', function ($http, $stateParams) {
                    return $http.post('/paymentMethod/getBySubProject', {
                        subproject: $stateParams.sId
                    });
                }]
            },
            ncyBreadcrumb: {
                parent: 'project.missions.details',
                label: 'Détails des missions'
            }
        })
        .state('upload', {
            url: "/upload",
            templateUrl: "app/partials/upload.html",
            controller: 'uploadCtrl',
            resolve: {
                navPromise: ['navService', function (navService) {
                    navService.page = 'Uploader un fichier';
                }]
            }
        })

}]);