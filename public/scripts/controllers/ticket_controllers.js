angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/tickets', {
                    templateUrl: 'views/tickets.html'
                })
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
                });
        }
    ])
    .factory('ticketStatus', function() {
        return [
            { text: 'Completed' , id: 1 },
            { text: 'Incomplete' , id: 2 },
            { text: 'Pending' , id: 3 },
            { text: 'Accepted' , id: 4 },
            { text: 'Confirmed' , id: 5 },
            { text: 'Installation Schedule' , id: 6 },
            { text: 'Re-schedule' , id: 7 },
            { text: 'After Service' , id: 8 },
            { text: 'Follow Up' , id: 9 },
            { text: 'Last Call' , id: 10 },
            { text: 'Recalled' , id: 11 },
            { text: 'Cancelled' , id: 12 },
            { text: 'Hold' , id: 13 },
            { text: 'Next Day Service' , id: 14 },
            { text: 'TB Called' , id: 15 },
            { text: 'Cash out' , id: 16 },
            { text: 'In-Process' , id: 17 },
            { text: 'Order Parts' , id: 18 },
        ];        
    })
    .factory('ticketUrgency', function() {
        return ['Urgent', 'Normal', 'Postpone'];
    })
    .factory('ticketProblem', function() {
        return {            
             _problemList: [    
                { 'text': 'No Cooling', 'status': false },
                { 'text': 'No Heating', 'status': false },
                { 'text': 'Duct Works', 'status': false },
                { 'text': 'Water Leak', 'status': false },
                { 'text': 'PM', 'status': false },
                { 'text': 'Frozen up', 'status': false },                                
                { 'text': 'Burning Smoke', 'status': false },
                { 'text': 'Condenser not working', 'status': false },
                { 'text': 'Tst Malfunction', 'status': false },
                { 'text': 'Estimate', 'status': false },
                { 'text': 'Running Constantly', 'status': false },
                { 'text': 'System runs nosily', 'status': false },
                { 'text': 'Pick up', 'status': false },
                { 'text': 'Follow up', 'status': false },
                { 'text': 'Replace', 'status': false },
            ],

            getList: function () {
                return this._problemList;
            },

            prepareList: function(problems) {
                var list = this.getList();
                var problemString = problems.split(',');
                angular.forEach(problemString, function(item) {
                    list[item] = 1;
                });
                return list;                
            },
            exportList: function(problems) {
                var text = null;
                angular.forEach(problems, function(value, key) {
                    if (value === 1) {
                        text = text + key + ',';
                    }
                });
                if (text.length) {
                    text = text.substring(0, text.length - 1);
                }
                return text;
            }                    
        };
    })       
    .controller('ticketsController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, dataService) {
            $scope.dataLoaded = false;
            $scope.search_params = {}; // to avoid the DOT notation quirk nature of javascript
            
            // populate the user list combobox
            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });
            
            var loadGrid = function () {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.ticket.template.html',
                    enableHorizontalScrollbar: 0,
                    columnDefs: [{
                        field: 'customer.name',
                        displayName: 'Customer',
                        width: 100
                    }, {
                        field: 'customer.phone',
                        displayName: 'Phone',
                        width: 100
                    }, {
                        field: 'create_by',
                        displayName: 'Created Date',
                        cellFilter: 'date : \'medium\'',
                        width: 100
                    }, {
                        field: 'promised_date',
                        displayName: 'Promised Date',
                        cellFilter: 'date: \'medium\'',
                        width: 100
                    }, {
                        field: 'status',
                        displayName: 'Status',
                        width: 100
                    }, {
                        field: 'problem',
                        displayName: 'Problem',
                        width: 100
                    }, {
                        field: 'urgency',
                        displayName: 'Urgency',
                        width: 100
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getAllTicket(function(result, err) {
                    $scope.gridOptions.data = _prepareData(result);
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };
            loadGrid();

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'view') {
                    var msg = '<h4><span style="white-space: pre-line; font-family: Verdana">';
                    msg += row.entity.job_note;
                    msg += '</span></h4>';
                    $bootbox.dialog({
                        size: 'large',
                        title: '<b>Ticket Detail</b>',
                        message: msg,
                        onEscape: true,
                        buttons: {
                            ok: {
                                label: 'OK'
                            }
                        }
                    });
                } else if (action === 'edit') {
                    dataService.set('ticket_to_edit', row.entity);
                    $location.path('/ticket/edit');
                } else if (action === 'delete') {
                    $bootbox.confirm('Are you sure you want to delete this ticket?', function(result) {
                        if (result) {
                            deleteTask(row.entity.id);
                        }
                    });
                }
            };

            var deleteTask = function(id) {
                var item_to_delete = {
                    id: id
                };
                $http.post(dataService.getApiUrl('/api/ticket/delete'), item_to_delete)
                    .then(function(result) {
                        if (result.data.message === 'success') {
                            $scope.reset();
                        }
                    })
                    .catch(function(err) {
                        $bootbox.alert(err.data);
                    });
            };

            $scope.quickSearch = function(is_search_archive) {
                $scope.dataLoaded = false;
                if (is_search_archive) {
                    $scope.search_params.status = 21;
                }
                dataService.findTicketWithOptions($scope.search_params, function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    $scope.showResult = true;
                    $scope.resultMsg = 'Found ' + result.length + ' record(s).';
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            $scope.reset = function() {
                $scope.search_params = {};
                $scope.showResult = false;
                $scope.dataLoaded = false;
                loadGrid();
            };
        }
    ])
   .controller('ticketCreateController', [
        '$scope',
        'dataService',
        'ticket',
        '$http',
        'ticketProblem',
        'ticketStatus',
        function($scope, dataService, ticket, $http, ticketProblem, ticketStatus) {            
            var init = function() {                        
                $scope.customer = {};
                $scope.ticket = ticket;
                $scope.customerNonExist = false;
                $scope.showAlert = false;
                $scope.alertType = 'success';
                $scope.alertMsg = '';
                $scope.isCreateCustomer = false;
                dataService.getUserList(function(result, err) {
                    $scope.employee_list = result;
                });
                dataService.getBuilderList(function(result,err) {
                    $scope.builders = result;
                });
                $scope.problems = JSON.parse(JSON.stringify(ticketProblem.getList())); // so hack-ish it makes a baby cry TvT

                $scope.statuses = ticketStatus;
            };
                        
            $scope.submitCustomerInfo = function () {
                searchCustomer();
            };

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
            
            var buildBuilderListFromResult = function(builders) {
                var newBuilderList = {};
                var customer = $scope.customer;                
                angular.forEach(builders, function(builder, index) {
                    if (builder.builder_id === customer.builder_1 || builder.builder_id === customer.builder_2 || builder.builder_id === customer.builder_3){
                        newBuilderList.push(builder);
                    }
                });
                return newBuilderList;
            }

            var searchCustomer = function() {
                dataService.findCustomerWithOptions($scope.customer, function(result, err) {
                    if(result.length > 0){                        
                        $scope.customerNonExist = false;
                        $scope.isCreateCustomer = false;
                        angular.forEach(result, function(customer, index){
                            customer.full_name = customer.first_name + ' ' + customer.last_name;
                            customer.full_description =  customer.full_name + ' at ' + customer.address;
                        });
                        $scope.customers = result;                        
                        var list = buildBuilderListFromResult($scope.builders);
                        $scope.builders = list;
                    } else {
                        $scope.customerNonExist = true;
                        $scope.isCreateCustomer = true;
                    }
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
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

            init();
        }
    ]);