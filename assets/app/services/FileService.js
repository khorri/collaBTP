'use strict';
app.factory('fileService',['$http','notificationService', function($http,notificationService){
    var f = {
        files : [],
        single:{}
    };
    f.getByProject = function(project, callback){
         return $http.post('/file/getByProject',{project: project.id}).success(function (data) {
            angular.copy(data, f.files);
            callback(f.files);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    };
   f.remove = function(fileId, callback){
        return $http.post('/file/removeDocument',{fileId:fileId}).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    };
     f.create = function(file, callback){
        return $http.post('/file/create',file).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
            notificationService.notify({
                title: 'Erreur',
                text: data.error,
                icon: 'fa fa-plus',
                type: 'danger',
                animate_speed: 'fast'
            });
        });
    }
    f.createNewVersion = function(obj, callback){
        return $http.post('/fileversion/create',obj).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
            notificationService.notify({
                title: 'Erreur',
                text: data.error,
                icon: 'fa fa-plus',
                type: 'danger',
                animate_speed: 'fast'
            });
        });
    }
    f.getVersions= function(obj, callback){
        return $http.post('/fileversion/getVersions',obj).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    }
    f.removeVersion = function(id, callback){
        return $http.post('/fileversion/remove',{id:id}).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    }
    f.update = function(file, callback){
        return $http.post('/file/update',file).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data.error)
        });
    }
    f.downloadVersion = function(obj,callback){
        return $http.post('/fileversion/downloadVersion',obj).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(data)
        });
    }
    return f;
}]);