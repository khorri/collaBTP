/**
 * Created by horri on 17/03/2015.
 */
app.controller('configCtrl', ['$scope', 'navService', '$sails', 'settingsService','$state','notificationService','$upload',
                        function ($scope, navService, $sails, settingsService, $state,  notificationService,$upload) {

    $scope.config = {};
    $scope.logoPath='http://www.rcomaroc.com/wp-content/uploads/2014/12/LOGO12.jpg';

    settingsService.get(function(){
        $scope.config = settingsService.settings;
        if($scope.config.logo.webPath)
            $scope.logoPath = $scope.config.logo.webPath;
    });

     $scope.saveConfig = function(){
        settingsService.update($scope.config,function(){
            notificationService.notify({
                title: 'Configuration enregistrée',
                text: 'Configuration enregistrée avec succès',
                icon: 'fa fa-plus',
                type: 'success',
                animate_speed: 'fast'
            });
        });
    }

    $scope.upload = function(files){
        if (files && files.length) {
            $upload.upload({
                url: '/file/uploadLogo',
                fileFormDataName: 'files',
                file: files,
                fields : {
                    settingId : ($scope.config.id) ? $scope.config.id : undefined
                }

            }).progress(function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                console.log(data);
                $scope.logoPath = data.file.webPath;
                $scope.isEditingImage=false;
                $scope.progressPercentage=0;
                $scope.config.logo=data;

            });
        }

    }

}]);