angular.module('themeApp.controllers', ['ui.grid'])
    .controller('loginController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$theme',
        '$cookies',
        function($scope, $timeout, $http, $location, $theme, $cookies) {
            $theme.set('fullscreen', true);

            $scope.$on('$destroy', function() {
                $theme.set('fullscreen', false);
            });

            $scope.login = function() {
                var request = 'https://acsdemo-yuhuynh.c9.io/api/auth/' + $scope.user.user_name + '/' + $scope.user.password;
                $http.post(request).success(function(res) {
                    if (res.message) {
                        if (res.message === "authorized") {
                            $cookies.name = res.name;
                            $location.path('/');
                        }
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            }
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
                    rowHeight: 100,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    columnDefs: [{
                        field: 'created_on',
                        cellFilter: 'date',
                        displayName: 'Created On',
                        width: 120
                    }, {
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
                        field: 'due_date',
                        cellFilter: 'date',
                        width: 120
                    }, {
                        field: 'readed',
                        cellFilter: 'readStatusFilter',
                        width: 100
                    }, {
                        name: ' button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                }
            }
           
            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'view') {
                    dataService.set('task_to_view', row.entity);
                    $location.path('/task_view');
                }
                else if (action === 'edit') {
                    dataService.set('task_to_edit', row.entity);
                    $location.path('/task_edit');
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
            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 100,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    columnDefs: [{
                        field: 'created_on',
                        cellFilter: 'date',
                        displayName: 'Created On',
                        width: 120
                    }, {
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
                        field: 'due_date',
                        cellFilter: 'date',
                        width: 120
                    }, {
                        field: 'readed',
                        cellFilter: 'readStatusFilter',
                        width: 100
                    }, {
                        name: ' button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.read.unread.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                }
            }
            
            $scope.getRowStyle = function(row) {
                if (row.entity.readed === false)
                    return {
                        'background-color': 'white',
                        'font-weight' : 'normal'
                    }
                else
                    return {
                        'background-color': '#ebeef0',
                        'color' : 'gray',
                    }
                   
            }
            
            $scope.buttonClickHandler = function($event, row, action) {
                var el = angular.element($event.toElement);
                el.attr('disabled', '');
                row.entity.readed = true;
                // if (action === 'view') {
                //     dataService.set('task_to_view', row);
                //     $location.path('/task_view');
                // }
                // else if (action === 'edit') {
                //     dataService.set('task_to_edit', row);
                //     $location.path('/task_edit');
                // }
            };

            $scope.dataLoaded = false;
            initGrid();
            
            dataService.getTaskByUser(function(result, err) {
                $scope.gridOptions.data = result;
                $scope.dataLoaded = true;
            });
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
                $http.post('https://acsdemo-yuhuynh.c9.io/api/task/update', $scope.task);
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
            $scope.list = [];
            dataService.getAnnoucementList(function(result, err) {
                $scope.list = result;
                //$scope.$apply();
            });
        }
    ]);