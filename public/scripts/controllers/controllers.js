angular.module('themeApp.controllers')
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
                            // var cookie = document.cookie;
                            // cookie = cookie + 'connect.sid=' + res.sid + ';path=/';
                            // document.cookie = cookie;
                            window.location.href = '/';
                        } else {
                            $scope.isError = true;
                            $scope.errorMsg = "Wrong username or password, please try again.";
                            el.removeAttr('disabled');
                        }
                    }
                }).catch(function(err) {
                    $scope.isError = true;
                    if (err.status === 401) {
                        $scope.errorMsg = "Wrong username or password, please try again.";
                        el.removeAttr('disabled');
                    } else
                        $scope.errorMsg = "Cannot connect to server. Please contact website administrator. (" + err.status + ')';
                    console.log(err);
                });
            };
        }
    ]);