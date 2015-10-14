angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/customer/new', {
                    templateUrl: 'views/customer_new.html'
                })
                .when('/customers', {
                    templateUrl: 'views/customers.html'
                });
        }
    ])
    .controller('customerController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, dataService) {
            $scope.customer = {};
            $scope.states = dataService.getListOfStates();
            $scope.builders = dataService.getBuilderList();
            $scope.customer.builder_1 = 1;

            var mode = dataService.get('user_load_mode');
            $scope.submit = function() {
                if (mode === 'edit') // updating model
                {
                    $http.post(dataService.getApiUrl('/api/customer/update'), $scope.customer)
                        .then(function(result) {
                            $location.path('/customers');
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
            }
        }
    ]);