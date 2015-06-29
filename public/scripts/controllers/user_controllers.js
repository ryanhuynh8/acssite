angular.module('themeApp.controllers')
    /* route setup */
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/users/new', {
                templateUrl: 'views/user_new.html'
            });
    }
    ])
    .controller('userController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.user = {};

            $scope.openDOB = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.openedDOB) $scope.openedDOB = false;
                else
                    $scope.openedDOB = true;
            };

            $scope.openDateHired = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.openedDateHired) $scope.openedDateHired = false;
                else
                    $scope.openedDateHired = true;
            };

            $scope.addUser = function () {
                console.log($scope.user);
            }
        }
    ]);