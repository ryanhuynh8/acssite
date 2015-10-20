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

            var mode = dataService.get('user_load_mode');
            $scope.mode = mode;

            if (mode === 'edit') {
                $scope.user = dataService.get('user_to_edit');
            }

            $scope.submit = function() {
                if (mode === 'edit') {// updating model
                    $http.post(dataService.getApiUrl('/api/customer/update'), $scope.customer)
                        .then(function(result) {
                            $location.path('/customers');
                        })
                        .catch(function(err) {
                            $scope.showAlert = true;
                            $scope.errorMsg = err;
                        });
                } else {
                    $http.post(dataService.getApiUrl('/api/customer/new'), $scope.customer)
                        .then(function(result) {
                            $scope.showAlert = false;
                            alert('New customer added!');
                            $location.path('/customers');
                        })
                        .catch(function(err) {
                            $scope.showAlert = true;
                            $scope.errorMsg = err;
                        });
                }
            }
        }
    ]);