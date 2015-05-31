angular.module('themeApp.controllers', ['ui.grid'])
    .controller('loginController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$theme',
        function($scope, $timeout, $http, $location, $theme) {
            $theme.set('fullscreen', true);

            $scope.$on('$destroy', function() {
                $theme.set('fullscreen', false);
            });

            $scope.login = function() {
                var request = '/api/auth/' + $scope.user.user_name + '/' + $scope.user.password;
                $http.post(request).success(function(res) {
                    if (res.message) {
                        if (res.message === "authorized") {
                            $location.path('/tasks');
                        }
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            }
        }
    ])
    .controller('taskController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 100,
                    columnDefs: [{
                        field: 'created_on',
                        cellFilter: 'date',
                        displayName: 'Created On',
                        width: 120
                    }, {
                        field: 'getAssigneeFullName()',
                        displayName: 'Assigned To',
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
                        field: 'due_date',
                        cellFilter: 'date',
                        width: 120
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                }
            }

            var loadData = function() {
                $http.get('/api/task/list')
                    .then(function(data) {
                        angular.forEach(data.data, function(row) {
                            row.getAssigneeFullName = function() {
                                if (row.assignee)
                                    return row.assignee.first_name + ' ' + row.assignee.last_name;
                                else
                                    return "none";
                            }
                        });
                        $scope.gridOptions.data = data.data;
                        $scope.dataLoaded = true;
                    })
            }

            $scope.buttonClickHandler = function(row, action) {
                if (action === 'view') {
                    dataService.set('task_to_view', row);
                    $location.path('/task_view');
                }
                else if (action === 'edit') {
                    dataService.set('task_to_edit', row);
                    $location.path('/task_edit');
                }
            };

            $scope.dataLoaded = false;
            initGrid();
            loadData();
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
                $http.post('/api/task/update', $scope.task);
            }
        }
    ])
    .controller('announcementController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    enableVerticalScrollbar: 2,
                    enableHorizontalScrollbar: 0,
                    rowHeight: 100,
                    columnDefs: [{
                        field: 'post_on_date',
                        cellFilter: 'date',
                        displayName: 'Posted Date',
                        width: 120
                    }, {
                        field: 'announcements_description',
                        width: '*',
                        displayName: 'Description',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }, {
                        field: 'expired_date',
                        cellFilter: 'date',
                        displayName: 'Expired Date',
                        width: 120
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
            };

            var loadData = function() {
                $http.get('/api/announcement/list')
                    .then(function(data) {
                        $scope.gridOptions.data = data.data;
                        $scope.dataLoaded = true;
                    });
            };


            $scope.dataLoaded = false;

            initGrid();
            loadData();
        }
    ]);