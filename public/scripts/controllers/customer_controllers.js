angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/customer/new', {
                    templateUrl: 'views/customer_new.html'
                })
                .when('/customer/edit', {
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
            $scope.customer.units = [];
            $scope.states = dataService.getListOfStates();
            $scope.builders = dataService.getBuilderList();

            var mode = dataService.get('user_load_mode');
            $scope.mode = mode;

            if (mode === 'edit') {
                $scope.customer = dataService.get('customer_to_edit');
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

            $scope.loadGrid = function() {
                $scope.gridOptions = {
                        enableColumnMenus: false,
                        rowHeight: 45,
                        enableHorizontalScrollbar: 0,
                        minRowsToShow: 20,
                        columnDefs: [{
                            field: 'first_name',
                            displayName: 'First Name',
                            width: 150
                        }, {
                            field: 'last_name',
                            displayName: 'Last Name',
                            width: 150
                        }, {
                            field: 'address',
                            displayName: 'Address',
                            width: '*'
                        }, {
                            field: 'email',
                            displayName: 'Email',
                            width: 200
                        }, {
                            name: 'button',
                            displayName: 'Action',
                            cellTemplate: 'views/grid_template/cell.customer.button.template.html',
                            width: 300
                        }],
                        data: []
                    };

                dataService.getCustomerList(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined)
                        dataService.showDatabaseErrorMessage($bootbox);
                });
            };

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'edit') {
                    dataService.set('customer_to_edit', row.entity);
                    dataService.set('user_load_mode', 'edit');
                    $location.path('/customer/edit');
                }
            };
        }
    ]);