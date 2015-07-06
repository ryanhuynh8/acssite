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
            $scope.showError = false;
            $scope.user = {};
            $scope.errorMsg = '';
            // default values
            $scope.user.sex = 'male';
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