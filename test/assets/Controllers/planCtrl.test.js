'use strict';
describe('planCtrl', function () {
    beforeEach(module('app'));
    var $injector = angular.injector(),
     $controller, $rootScope, planService, $state, $httpBackend, projectService,
     state = 'project.plans',
     plans = [],
     project,
     scope,
     planCtrl;

    beforeEach(inject(function (_$controller_, _$rootScope_, _$state_, planService, _$injector_, $templateCache, _$httpBackend_,ngDialog,notificationService,projectService) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $state = _$state_;
        planService = planService;
        $injector = _$injector_;
        $httpBackend = _$httpBackend_;
        projectService.getAll(function(){
            project = this.projects[0];
        });
        project.data = { };
        ngDialog = $injector.get('ngDialog');
        scope = $rootScope.$new();
        planCtrl = $controller('planCtrl',{
            $scope: scope,
            project: project,
            planService: projectService,
            plans: plans,
            ngDialog: ngDialog,
            notificationService: notificationService
        });

        $templateCache.put('app/partials/projectTabs/plansTab.html', '');
    }));
    
    describe("Project should be defined and plans is array", function(){
        it("Project should be defined", function(){
            console.log(project);
           should.exist( project);
        });
    });

    describe("Add new necessary document", function(){

       it("Document should be added", function(){
           scope.documents = [];
           should(scope.documents).to.have.lengthOf(0);

       });
    });


   /* describe('#resolve plans', function () {

        it('should respond to URL', function () {
            //$state.href(state).should.equal('#/project//plans');

             var $scope = $rootScope.$new;
             var controller = $controller('planCtrl', {
                 $scope: $scope,
                 project: project,
                 planService: planService,
                 plans: plans,
                 ngDialog: ngDialog
             });


        });
        it('should resolve data', function () {
            //myServiceMock.findAll = jasmine.createSpy('findAll').and.returnValue('findAll');
            // earlier than jasmine 2.0, replace "and.returnValue" with "andReturn"
            //$httpBackend.when('GET', '/participant/getAll').passThrough();
            $state.expectTransitionTo(state);
            $state.go(state);
            $rootScope.$digest();
            $state.current.name.should.equal(state);
            //$rootScope.$apply();
            //$state.current.name.should.equal(state);

            // Call invoke to inject dependencies and run function
            //$injector.get($state.current.resolve.data);
            //console.log($state.current.resolve.data);
        });
    });*/
});