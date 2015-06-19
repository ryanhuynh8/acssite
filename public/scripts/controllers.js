angular.module('themeApp.controllers', ['ui.grid'])
    .controller('loginController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$theme',
        '$cookies',
        'dataService',
        function($scope, $timeout, $http, $location, $theme, $cookies, dataService) {
            $theme.set('fullscreen', true);

            $scope.$on('$destroy', function() {
                $theme.set('fullscreen', false);
            });


            $scope.isError = false;
            $scope.login = function($event) {
                // disable login button
                var el = angular.element($event.toElement);
                el.attr('disabled', '');

                // var request = 'http://acsdemo-yuhuynh.c9.io/api/auth/' + $scope.user.user_name + '/' + $scope.user.password;
                var request = dataService.getApiUrl('/api/auth');
                $http.post(request, {
                    user_name: $scope.user.user_name,
                    password: $scope.user.password
                }).success(function(res) {
                    if (res.message) {
                        if (res.message === "authorized") {
                            $cookies.name = res.name;
                            $location.path('/');
                        } else {
                            $scope.isError = true;
                            $scope.errorMsg = "Wrong username or password, please try again.";
                            el.removeAttr('disabled');
                        }
                    }
                }).catch(function(err) {
                    $scope.errorMsg = "Cannot connect to server. Please contact website administrator.";
                    $scope.isError = true;
                    console.log(err);
                })
            }
        }
    ])
    .controller('announcementController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.list = [];
            dataService.getAnnoucementList(function(result, err) {
                $scope.list = result;
                //$scope.$apply();
            });
        }
    ]);