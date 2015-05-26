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
        'dataService',
        function($scope, $timeout, $http, dataService) {
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
                    })
            }

            $scope.buttonClickHandler = function(row, action) {
                if (action === 'view') {
                    dataService.set('task_to_view', row);
                }
                else if (action === 'edit') {
                    dataService.set('task_to_edit', row);
                }
            };

            initGrid();
            loadData();
        }
    ])