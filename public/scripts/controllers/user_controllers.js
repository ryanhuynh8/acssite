angular.module('themeApp.controllers')
    /* route setup */
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/users/new', {
                templateUrl: 'views/user_new.html'
            })
            .when('/users', {
                templateUrl: 'views/users.html'
            });
    }
    ])
    .controller('userController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, dataService) {
            $scope.user = {};
            $scope.showAlert = false;
            $scope.dataLoaded = false;

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

            var validate = function() {
                return true;
            };

            $scope.submit = function () {
                if (!validate()) return;
                $http.post(dataService.getApiUrl('/api/user/new'), $scope.user)
                    .then(function(result) {
                        alert('success');
                        $scope.showAlert = false;
                        $location.path('/');
                    })
                    .catch(function(err) {
                        $scope.showAlert = true;
                        $scope.errorMsg = err;
                    });
            }

            $scope.loadGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 30,
                    enableHorizontalScrollbar: 0,
                    minRowsToShow: 20,
                    columnDefs: [{
                        field: 'user_name',
                        displayName: 'Username',
                        width: 150
                    }, {
                        field: 'full_name',
                        displayName: 'Employee Name',
                        width: '*'
                    }, {
                        field: 'sex',
                        displayName: 'Sex',
                        cellFilter: 'sexFilter',
                        width: 150
                    }, {
                        field: 'email',
                        displayName: 'Email',
                        width: 200
                    }, {
                        field: 'date_hired',
                        displayName: 'Date Hired',
                        cellFilter: 'date',
                        width: 150
                    }, {
                        field: 'employee_type',
                        cellFilter: 'employeeTypeFilter',
                        displayName: 'Employee Type',
                        width: 150
                    }],
                    data: []
                };
                dataService.getUserListFullInfo(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined)
                        dataService.showDatabaseErrorMessage($bootbox);
                })
            };
        }
    ]);