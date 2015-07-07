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
        function($scope, $timeout, $http, $location, dataService) {
            $scope.dataLoaded = false;
            $scope.showError = false;
            $scope.user = {};
            $scope.errorMsg = '';
            // default values
            $scope.user.sex = 0;
            $scope.user.employee_type = 0;

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

            var validate = function() {
                var user = $scope.user;
                var email_regex = /\S+@\S+/;
                $scope.errorMsg = '';

                // check for required
                if (!user.first_name) $scope.errorMsg += 'Please enter the first name.\n';
                if (!user.last_name) $scope.errorMsg += 'Please enter the last name.\n';
                if (!user.address) $scope.errorMsg += 'Please enter the address.\n';
                if (!user.state) $scope.errorMsg += 'Please enter the state.\n';
                if (!user.city) $scope.errorMsg += 'Please enter the city.\n';
                if (!user.zip) $scope.errorMsg += 'Please enter the zipcode.\n';
                if (!user.phone1) $scope.errorMsg += 'Please enter at least one phone number.\n';
                if (!user.email) $scope.errorMsg += 'Please enter an email.\n';
                if (!user.user_name) $scope.errorMsg += 'Please enter a username.\n';
                if (!user.password) $scope.errorMsg += 'Please enter a password.\n';
                // check for data format
                if (!isNumeric(user.zip)) $scope.errorMsg += 'Please enter a valid zipcode.\n';
                if (!isNumeric(user.phone1) || !isNumeric(user.phone2)) $scope.errorMsg += 'Please enter valid phone number(s).\n';
                if (!email_regex.test(user.email)) $scope.errorMsg += 'Please enter a valid email address, ie: abc@def.com.\n';
                // check for password matching
                if (user.password !== user.confirm_password) $scope.errorMsg += 'Passwords do not match.\n';
                if ($scope.errorMsg !== '')
                {
                    $scope.showError = true;
                }
            };

            $scope.submit = function () {
                validate();
                console.log($scope.user);
            }

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
        }
    ]);