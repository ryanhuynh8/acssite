angular.module('themeApp.controllers')
    /* route setup */
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/tasks', {
                templateUrl: 'views/tasks.html'
            })
            .when('/tasks/new', {
                templateUrl: 'views/task_new.html'
            })
            .when('/tasks/edit', {
                templateUrl: 'views/task_edit.html'
            })
            .when('/tasks/view', {
                templateUrl: 'views/task_view.html'
            });
        }
    ])
    .controller('taskAdminController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    columnDefs: [{
                        field: 'poster_fullname',
                        displayName: 'Assigned By',
                        width: 150
                    }, {
                        field: 'task_description',
                        width: '*',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }, {
                        field: 'status_task_id',
                        cellFilter: 'taskStatusFilter',
                        width: 100,
                        displayName: 'Status'
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
            };

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'view') {
                    dataService.set('task_to_view', row.entity);
                    $location.path('/tasks/view');
                }
                else if (action === 'edit') {
                    dataService.set('task_to_edit', row.entity);
                    $location.path('/tasks/edit');
                }
            };

            $scope.dataLoaded = false;
            initGrid();

            dataService.getAllTask(function(result, err) {
                $scope.gridOptions.data = result;
                $scope.dataLoaded = true;
            });
        }
    ])
    .controller('taskController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.search_params = {};  // to avoid the DOT notation quirk nature of javascript
            // populate the user list combobox
            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });

            $scope.status_list = ["In-progress", "Completed", "Cancelled"];

            $timeout(function() {
                $('[data-toggle="tooltip"]').tooltip({
                    'placement': 'top'
                });
            });

            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    minRowsToShow: 5,
                    columnDefs: [{
                        field: 'poster_fullname',
                        displayName: 'Assigned By',
                        width: 150
                    }, {
                        field: 'task_description',
                        width: '*',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }, {
                        name: ' button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.read.unread.button.template.html',
                        width: 150
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
            };

            $scope.getRowStyle = function(row) {
                if (row.entity.readed === true)
                    return {
                        // 'background-color': 'white',
                        'font-weight': 'normal'
                    }
            };

            $scope.buttonClickHandler = function($event, row, action) {
                var el = angular.element($event.toElement);

                if (action === 'mark_as_read') {
                    row.entity.readed = true;
                    el.attr('disabled', '');
                }
                else if (action === 'mark_as_completed') {
                    var index = $scope.gridOptions.data.indexOf(row.entity);
                    $scope.gridOptions.data.splice(index, 1);
                    // el.closest('.ui-grid-row')
                    //   .animate({
                    //         opacity: '0.0',
                    //     }, 1000, function() {
                    //         console.log('completed');

                    //     });
                }
            };

            $scope.dataLoaded = false;
            initGrid();

            dataService.getTaskByUser(function (result, err) {
                $scope.gridOptions.data = result;
                $scope.dataLoaded = true;
            });

            $scope.quickSearch = function() {
                $scope.dataLoaded = false;
                dataService.findTaskWithOptions($scope.search_params, function (result, err) {
                    console.log(result);
                });
            };

            $scope.reset = function() {
                $scope.search_params = {};
            };
        }
    ])
    .controller('taskViewController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.task = dataService.get('task_to_view');
        }
    ])
    .controller('taskEditController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.task = dataService.get('task_to_edit');
            $scope.user_list = [];
            $scope.dt = $scope.task.due_date;

            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
                $scope.selected_user = $scope.task.assign_by;
            });

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.opened) $scope.opened = false;
                else
                    $scope.opened = true;
            };

            $scope.updateTask = function() {
                $http.post('http://acsdemo-yuhuynh.c9.io/api/task/update', $scope.task);
            }
        }
    ])
    .controller('taskCreateController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.task = {};
            $scope.user_list = [];
            $scope.dt = new Date();
            $scope.task.due_date = Date.now();
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';

            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.opened) $scope.opened = false;
                else
                    $scope.opened = true;
            };

            $scope.submit = function() {
                $http.post('http://acsdemo-yuhuynh.c9.io/api/task/new', $scope.task)
                    .then(function(result) {
                        if (result.data.message !== 'success'){
                            throw result.data;
                        }
                        // display successfully alert
                        $scope.showAlert = true;
                        $scope.alertType = 'success';
                        $scope.alertMsg = 'New task added successfully. Redirecting to dashboard now...';
                        $timeout(function() {
                            $location.path('/');
                        }, 2000)
                    }).
                    catch(function(err) {
                        $scope.showAlert = true;
                        $scope.alertType = 'danger';
                        $scope.alertMsg = 'Error creating a new task!';
                    });
            }

            $scope.reset = function() {
                $scope.task = {};
            };
        }
    ]);
