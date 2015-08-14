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

        }
    ]);