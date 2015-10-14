angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/user/new', {
                    templateUrl: 'views/user_new.html'
                })
                .when('/user/edit', {
                    templateUrl: 'views/user_new.html' // template re-use xP
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
            $scope.dataLoaded = false;
            $scope.showError = false;
            $scope.user = {};
            $scope.errorMsg = '';

            // default values
            $scope.user.sex = 0;
            $scope.user.employee_type = 0;

            var mode = dataService.get('user_load_mode');
            console.log(mode);
            $scope.mode = mode;
            if (mode === 'edit') {
                $scope.user = dataService.get('user_to_edit');
            }

            $scope.open1 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened1 = true;

            };

            $scope.open2 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened2 = true;
            };

            $scope.submit = function() {
                if (!validate()) return;
                // are we updating existing or creating a new user?
                if (mode === 'edit') // updating model
                {
                    $http.post(dataService.getApiUrl('/api/user/update'), $scope.user)
                        .then(function(result) {
                            $location.path('/users');
                        })
                        .catch(function(err) {
                            $scope.showAlert = true;
                            $scope.errorMsg = err;
                        });
                } else {
                    $http.post(dataService.getApiUrl('/api/user/new'), $scope.user)
                        .then(function(result) {
                            $scope.showAlert = false;
                            alert('New user added!');
                            $location.path('/users');
                        })
                        .catch(function(err) {
                            $scope.showAlert = true;
                            $scope.errorMsg = err;
                        });
                }
            };

            $scope.loadGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 45,
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
                        field: 'email',
                        displayName: 'Email',
                        width: 200
                    }, {
                        field: 'employee_type',
                        cellFilter: 'employeeTypeFilter',
                        displayName: 'Employee Role',
                        width: 150
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.user.button.template.html',
                        width: 300
                    }],
                    data: []
                };
                dataService.getUserListFullInfo(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined)
                        dataService.showDatabaseErrorMessage($bootbox);
                });
            };

            var validate = function() {
                var user = $scope.user;
                var email_regex = /\S+@\S+/;

                $scope.showErorr = false;
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
                if (!isNumeric(user.phone1)) $scope.errorMsg += 'Please enter a valid first phone number.\n';
                if (!isNumeric(user.phone2) && (user.phone2 !== '')) $scope.errorMsg += 'Please enter a valid second phone number.\n';
                if (!email_regex.test(user.email)) $scope.errorMsg += 'Please enter a valid email address, ie: abc@def.com.\n';
                // check for password matching
                if (user.password !== user.confirm_password) $scope.errorMsg += 'Passwords do not match.\n';
                if ($scope.errorMsg !== '') {
                    $scope.showError = true;
                }

                if ($scope.errorMsg !== '') return false;
                else return true;
            };

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'edit') {
                    dataService.set('user_to_edit', row.entity);
                    dataService.set('user_load_mode', 'edit');
                    $location.path('/user/edit');
                }
            };

            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

        }
    ]);