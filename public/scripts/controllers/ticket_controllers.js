angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/tickets/new', {
                    templateUrl: 'views/ticket_new.html',
                    controller: 'ticketCreateController',
                    resolve: {
                        'ticket': function() {
                            return {
                                status: null,
                                ticket_type: null,
                                invoice_id: null,
                                office_id: null,
                                dispatch_id: null,
                                customer_id: null,
                                problem: null,
                                office_note: null,
                                job_note: null,
                                job_date: null,
                                assign_tech: null,
                                seller: null,
                                promised_date: null,
                                promised_time_from: null,
                                promise_time_to: null,
                                urgency: null                                
                            };
                        }
                    }
                    
                })
                .when('/customers', {
                    templateUrl: 'views/customers.html'
                });
        }
    ])
   .controller('ticketCreateController', [
        '$scope',
        'dataService',
        'ticket',
        '$http',
        function($scope, dataService, ticket, $http) {
            $scope.customer = {};
            $scope.ticket = ticket;
            $scope.customerNonExist = false;
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';
            $scope.isCreateCustomer = false;
            
            
            
            var _createCustomer = function () {
                $http.post(dataService.getApiUrl('/api/customer/new'), $scope.customer)
                .then(function(result) {
                    console.log(result);
                    $scope.showAlert = false;
                    alert('New customer added!');
                });
            };
            
            var _searchCustomer = function () {
                dataService.findCustomerWithOptions($scope.customer, function(result, err) {
                    if(!err){
                        $scope.customerNonExist = false;
                        $scope.customer = result;
                    } else {
                        $scope.customerNonExist = true;
                    }
                });
            };
            
            $scope.submitCustomerInfo = function () {
                if ($scope.isCreateCustomer) 
                    _createCustomer()
                else
                    _searchCustomer()
            };
            

//            $scope.minDate = new Date();
//
//            dataService.getUserList(function(result, err) {
//                $scope.user_list = result;
//            });

            $scope.openJobdate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.isOpenJobDate) $scope.isOpenJobDate = false;
                else
                    $scope.isOpenJobDate = true;
            };
            
            $scope.openPromiseddate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.isOpenPromisedDate) $scope.isOpenPromisedDate = false;
                else
                    $scope.isOpenPromisedDate = true;
            };
            

            var validate = function() {
                if (moment().isBefore(moment($scope.task.due_date)) || moment().isSame(moment($scope.task.due_date), 'day')) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.submit = function() {
                $scope.ticket.customer_id = $scope.customer.id;
                
                $http.post(dataService.getApiUrl('/api/ticket/new'), $scope.ticket)
                .then(function(result) {
                    if (result.data.message !== 'success') {
                        throw result.data;
                    }
                    // display successfully alert
                    $scope.showAlert = true;
                    $scope.alertType = 'success';
                    $scope.alertMsg = 'New ticket added successfully. Redirecting to dashboard now...';
                    $timeout(function() {
                        $location.path('/');
                    }, 2000);
                })
                .catch(function(err) {
                    $scope.showAlert = true;
                    $scope.alertType = 'danger';
                    $scope.alertMsg = 'Error creating a new ticket!';
                    console.log(err);
                });
                
            };

            $scope.reset = function() {
                $scope.task = {};
            };
        }
    ]);