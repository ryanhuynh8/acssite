angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/tickets', {
                    templateUrl: 'views/tickets.html',
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
                                promised_time_to: null,
                                urgency: null
                            };
                        }
                    }
                })
                .when('/tickets/edit', {
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
                                promised_time_to: null,
                                urgency: null
                            };
                        }
                    }
                })
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
    .filter('urgencyFilter', ['ticketUrgency', function(ticketUrgency){
        return function(value) {
            return ticketUrgency[value];
        }
    }])
    .filter('statusFilter', ['ticketStatus', function(ticketStatus) {
        return function(value) {
            var result;
            angular.forEach(ticketStatus, function(status, index){
                if (status.id.toString() === value)
                {
                    result = status.text;
                }
            });
            return result;
        }
    }])
    .filter('problemFilter', ['ticketProblem', function(ticketProblem){
        return function(value){
            var problemList = JSON.parse(value);
            var problems = '';
            angular.forEach(problemList, function(problem, index){
                if (problem.status === true)
                    problems += '- '+ problem.text + '\n';
            });
            return problems;
        }
    }])
    .controller('ticketsController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        '$filter',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, $filter, dataService) {

            var init = function() {
                $scope.dataLoaded = false;
                $scope.search_params = {}; // to avoid the DOT notation quirk nature of javascript
                $scope.datePickerStatus = [];
                $scope.datePickerStatus.isOpen1 = false;
                $scope.datePickerStatus.isOpen2 = false;
            }

            $scope.open1 = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePickerStatus.isOpen1 = !$scope.datePickerStatus.isOpen1;
            }

            $scope.open2 = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePickerStatus.isOpen2 = !$scope.datePickerStatus.isOpen2;
            }

            // populate the user list combobox
            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });

            var loadGrid = function () {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 80,
                    //rowTemplate: 'views/grid_template/row.ticket.template.html',
                    enableHorizontalScrollbar: 0,
                    columnDefs: [{
                        field: 'Customer.name',
                        displayName: 'Customer',
                        width: 150
                    }, {
                        field: 'Customer.phone1',
                        displayName: 'Phone',
                        width: 100
                    }, {
                        field: 'create_on',
                        displayName: 'Created Date',
                        cellFilter: 'date',
                        width: 100
                    }, {
                        field: 'promised_date',
                        displayName: 'Promised Date',
                        cellFilter: 'date',
                        width: 100
                    }, {
                        field: 'problem',
                        display: 'Problems',
                        cellFilter: 'problemFilter',
                        cellTemplate: 'views/grid_template/cell.problem.text.template.html',
                        width: 250
                    }, {
                        field: 'status',
                        displayName: 'Status',
                        cellFilter: 'statusFilter',
                        width: 100
                    }, {
                        field: 'urgency',
                        displayName: 'Urgency',
                        cellFilter: 'urgencyFilter',
                        width: 100
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.ticket.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getAllTicket(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };
            loadGrid();

            $scope.reset = function() {
                $scope.search_params = {};
                $scope.showResult = false;
                $scope.dataLoaded = false;
                loadGrid();
            };

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'edit') {
                    dataService.set('ticket_to_edit', row.entity);
                    dataService.set('ticket_load_mode', 'edit');
                    $location.path('/tickets/edit');
                }
            };

            $scope.quickSearch = function () {
                $scope.dataLoaded = false;
                $scope.search_params.jobDateFrom = $filter('date')($scope.search_params.jobDateFrom, 'yyyy/MM/dd');
                $scope.search_params.jobDateTo = $filter('date')($scope.search_params.jobDateTo, 'yyyy/MM/dd');
                dataService.findTicket($scope.search_params, function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    $scope.showResult = true;
                    $scope.resultMsg = 'Found ' + result.length + ' record(s).';
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            }
            init();
        }
    ])
   .controller('ticketCreateController', [
        '$scope',
        'dataService',
        'ticket',
        '$http',
        '$timeout',
        '$location',
        '$filter',
        'ticketProblem',
        'ticketStatus',
        function($scope, dataService, ticket, $http, $timeout, $location, $filter, ticketProblem, ticketStatus) {
            var init = function() {
                /* edit mode */
                if (dataService.get('ticket_load_mode') === 'edit')
                {
                    dataService.set('ticket_load_mode', null);
                    $scope.isEdit = true;
                    $scope.ticket = dataService.get('ticket_to_edit');
                    $scope.ticket.status = parseInt($scope.ticket.status);
                    $scope.ticket.problem = JSON.parse($scope.ticket.problem);
                    $scope.customer = $scope.ticket.Customer;
                    $scope.customer.builder = $scope.ticket.builder_id;
                    $scope.isCreateCustomer = false;
                    $scope.disabledEdit = true;
                    $scope.mainButtonLabel = "Update ticket";
                    $scope.ticket.officeNotes = JSON.parse($scope.ticket.office_note);
                    $scope.ticket.jobNotes = JSON.parse($scope.ticket.job_note);
                }
                /* create new ticket mode */
                else
                {
                    $scope.customer = {};
                    $scope.customers = [];
                    $scope.selectedCustomer = {};
                    $scope.ticket = ticket;
                    $scope.ticket.officeNotes = [];
                    $scope.ticket.jobNotes = [];
                    $scope.isCreateCustomer = false;
                    $scope.isEdit = false;
                    $scope.disabledEdit = false;
                    $scope.ticket.problem = JSON.parse(JSON.stringify(ticketProblem.getList())); // deep cloning array of object - so hack-ish it makes a baby cry TvT
                    dataService.getLastTicketId(function(result,err){
                        var n = result.last_id + 1;
                        $scope.ticket.invoice_id = 'R' + n;
                    });
                    $scope.mainButtonLabel = "Create ticket";
                }
                $scope.customerNonExist = false;
                $scope.showAlert = false;
                $scope.alertType = 'success';
                $scope.alertMsg = '';
                $scope.datePickerStatus = {};

                dataService.getUserList(function(result, err) {
                    $scope.employee_list = result;
                });
                dataService.getBuilderList(function(result,err) {
                    $scope.builders = result;
                    $scope.customer.builders = $scope.builders;
                });


                $scope.statuses = ticketStatus;
            };

            $scope.submitCustomerInfo = function () {
                searchCustomer();
            };

            $scope.openJobdate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.datePickerStatus.isOpenJobDate) $scope.datePickerStatus.isOpenJobDate = false;
                else
                    $scope.datePickerStatus.isOpenJobDate = true;
            };

            $scope.openPromiseddate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.datePickerStatus.isOpenPromisedDate) $scope.datePickerStatus.isOpenPromisedDate = false;
                else
                    $scope.datePickerStatus.isOpenPromisedDate= true;
            };


            var buildBuilderListFromResult = function(builders) {
                var newBuilderList = [];
                var customer = $scope.customer;
                angular.forEach(builders, function(builder, index) {
                    if (builder.builder_id === customer.builder_1 || builder.builder_id === customer.builder_2 || builder.builder_id === customer.builder_3) {
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
                        $scope.disabledEdit = true;
                        angular.forEach(result, function(customer, index){
                            customer.full_description =  customer.name + ' at ' + customer.address;
                        });
                        $scope.customers = result;
                        $scope.builders = list;
                    } else {
                        $scope.customerNonExist = true;
                    }
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            $scope.customerChange = function() {
                angular.forEach($scope.customers, function(customer, index){
                    if ($scope.selectedCustomer.id === customer.id)
                    {
                        $scope.customer = customer;
                        $scope.customer.builders = buildBuilderListFromResult($scope.builders);
                    }
                });
            };

            $scope.builderChange = function() {
                $scope.ticket.builder_id = $scope.customer.builder;
                /* find the builder from list */
                var builder = {};
                angular.forEach($scope.builders, function(builder, index){
                    if (builder.builder_id === $scope.customer.builder)
                    {
                        $scope.ticket.office_id = builder.office_number;
                        dataService.getBuilderIndex(builder.builder_id, function(result, err){
                            $scope.ticket.dispatch_id = result;
                            if (err !== undefined) {
                                dataService.showDatabaseErrorMessage($bootbox);
                            }
                        });
                    }
                })
            };

            $scope.officeNoteKeyPressed = function ($event) {
                $event.stopPropagation();
                if ($event.keyCode === 13) {
                    $event.preventDefault();
                    var newNote = {};
                    newNote.text = $scope.ticket.office_note_input;
                    newNote.time = moment().format('lll');
                    $scope.ticket.officeNotes.push(newNote);
                    $scope.ticket.office_note_input = '';
                }
            };

            $scope.jobNoteKeyPressed = function ($event) {
                $event.stopPropagation();
                if ($event.keyCode === 13) {
                    $event.preventDefault();
                    var newNote = {};
                    newNote.text = $scope.ticket.job_note_input;
                    newNote.time = moment().format('lll');
                    $scope.ticket.jobNotes.push(newNote);
                    $scope.ticket.job_note_input = '';
                }
            };

            $scope.submit = function () {
                if (!$scope.isEdit) {
                    $scope.ticket.customer_id = $scope.customer.id;
                    $scope.ticket.problem = angular.toJson($scope.ticket.problem);
                    $scope.ticket.promised_date = $filter('date')($scope.ticket.promised_date, 'yyyy/MM/dd');
                    $scope.ticket.job_date = $filter('date')($scope.ticket.job_date, 'yyyy/MM/dd');
                    $scope.ticket.office_note = JSON.stringify($scope.ticket.officeNotes);
                    $scope.ticket.job_note = JSON.stringify($scope.ticket.jobNotes);

                    /* create new customer if we are not using search */
                    if ($scope.isCreateCustomer) {
                        $scope.ticket.customer = $scope.customer;
                    }
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
                }
            };

            $scope.resetSearch = function() {
                $scope.disabledEdit = false;
                $scope.customer = {};
                $scope.customer.builders = $scope.builders;
                $scope.customers = [];
                $scope.isCreateCustomer = true;
                $scope.selectedCustomer = {};
            };

            init();
        }
    ]);