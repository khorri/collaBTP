'use strict';
app.factory('planService',['$http', function($http){
    var p = {
        plans : [],
        single:{}
    };
    p.getByProject = function(project, callback){
         return $http.post('/plan/getByProject',{project: project.id}).success(function (data) {
            angular.copy(data, p.plans);
            callback(p.plans);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    };
    p.remove = function(planId, callback){
        return $http.post('/plan/remove',{id:planId}).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    };
    p.create = function(plan, callback){
        return $http.post('/plan/create',plan).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    }
    return p;
}]);