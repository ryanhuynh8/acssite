angular.module('themeApp.controllers')
    .config(['$routeProvider',
        function($routeProvider) {
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
                .when('/tasks/:id/view', {
                    templateUrl: 'views/task_view.html'
                })
                .when('/tasks/archived', {
                    templateUrl: 'views/tasks_archived.html'
                })
                .when('/tasks/all/archived', {
                    templateUrl: 'views/tasks_archived_all.html'
                });

        }
    ])
    .controller('taskAdminController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, dataService) {
            $scope.dataLoaded = false;
            $scope.search_params = {}; // to avoid the DOT notation quirk nature of javascript
            var mode = null;
            $scope.setLoadMode = function(is_archived) {
                if (is_archived) {
                    loadArchivedGrid();
                    mode = 'archived';
                } else {
                    loadGrid();
                    mode = 'all';
                }
            };

            // populate the user list combobox
            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });

            $timeout(function() {
                $('[data-toggle="tooltip"]').tooltip({
                    'placement': 'top'
                });
            });

            var loadGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    columnDefs: [{
                        field: 'created_on',
                        displayName: 'Posted On',
                        cellFilter: 'date : \'medium\'',
                        width: 200
                    }, {
                        field: 'poster_fullname',
                        displayName: 'Posted By',
                        width: 150
                    }, {
                        field: 'assignee_fullname',
                        displayName: 'Assigned To',
                        width: 150
                    }, {
                        field: 'task_description',
                        width: '*',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }, {
                        name: 'button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.button.template.html',
                        width: 200
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getAllTask(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            var loadArchivedGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    columnDefs: [{
                        field: 'created_on',
                        displayName: 'Posted On',
                        cellFilter: 'date : \'medium\'',
                        width: 200
                    }, {
                        field: 'poster_fullname',
                        displayName: 'Posted By',
                        width: 150
                    }, {
                        field: 'assignee_fullname',
                        displayName: 'Assigned To',
                        width: 150
                    }, {
                        field: 'task_description',
                        width: '*',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getAllArchivedTask(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            $scope.buttonClickHandler = function($event, row, action) {
                if (action === 'view') {
                    var msg = '<h4><span style="white-space: pre-line; font-family: Verdana">';
                    msg += row.entity.task_description;
                    msg += '</span></h4>';
                    $bootbox.dialog({
                        size: 'large',
                        title: '<b>Task Detail</b>',
                        message: msg,
                        onEscape: true,
                        buttons: {
                            ok: {
                                label: 'OK'
                            }
                        }
                    });
                } else if (action === 'edit') {
                    dataService.set('task_to_edit', row.entity);
                    $location.path('/tasks/edit');
                } else if (action === 'delete') {
                    $bootbox.confirm('Are you sure you want to delete this task?', function(result) {
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
                $http.post(dataService.getApiUrl('/api/task/delete'), item_to_delete)
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
                dataService.findTaskWithOptions($scope.search_params, function(result, err) {
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
                if (mode === 'archived') {
                    loadArchivedGrid();
                } else {
                    loadGrid();
                }
            };
        }
    ])
    .controller('taskController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$bootbox',
        'dataService',
        function($scope, $timeout, $http, $location, $bootbox, dataService) {
            $scope.search_params = {}; // to avoid the DOT notation quirk nature of javascript
            $scope.showResult = false;
            $scope.dataLoaded = false;
            $scope.is_archived = false;
            var mode = null;

            $scope.setLoadMode = function(is_archived) {
                if (is_archived) {
                    loadArchivedGrid();
                    mode = 'archived';
                } else {
                    loadGrid();
                    mode = 'all';
                }
            };

            var loadArchivedGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    minRowsToShow: 5,
                    columnDefs: [{
                        field: 'created_on',
                        displayName: 'Posted On',
                        cellFilter: 'date : \'medium\'',
                        width: 200
                    }, {
                        field: 'poster_fullname',
                        displayName: 'Assigned By',
                        width: 150
                    }, {
                        field: 'task_description',
                        width: '*',
                        cellTemplate: 'views/grid_template/cell.text.template.html'
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getArchivedTaskByUser(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            var loadGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    enableColumnResizing: true,
                    rowHeight: 150,
                    rowTemplate: 'views/grid_template/row.task.template.html',
                    enableHorizontalScrollbar: 0,
                    minRowsToShow: 5,
                    columnDefs: [{
                        field: 'created_on',
                        displayName: 'Posted On',
                        cellFilter: 'date : \'medium\'',
                        width: 200
                    }, {
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
                        cellTemplate: 'views/grid_template/cell.task.button.template.html',
                        width: 300
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getTaskByUser(function(result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined) {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            $scope.getRowStyle = function(row) {
                if (row.entity.readed === true)
                    return {
                        // 'background-color': 'white',
                        'font-weight': 'normal'
                    };
            };

            $scope.buttonClickHandler = function($event, row, action) {
                var el = angular.element($event.toElement);

                if (action === 'mark_as_read') {
                    // note: we are not handling any error here
                    $http.post(dataService.getApiUrl('/api/task/readed'), row.entity);
                    row.entity.readed = true;
                    el.attr('disabled', '');
                } else if (action === 'mark_as_completed') {
                    row.entity.task_description = 'Archiving, please wait...';
                    $http.post(dataService.getApiUrl('/api/task/archive'), row.entity)
                        .then(function(result) {
                            var index = $scope.gridOptions.data.indexOf(row.entity);
                            $scope.gridOptions.data.splice(index, 1);
                        });
                } else if (action === 'view') {
                    var msg = '<h4><span style="white-space: pre-line;font-family: Verdana">';
                    msg += row.entity.task_description;
                    msg += '</span></h4>';
                    $bootbox.dialog({
                        size: 'large',
                        title: '<b>Task Detail</b>',
                        message: msg,
                        onEscape: true,
                        buttons: {
                            ok: {
                                label: 'OK'
                            }
                        }
                    });
                } else if (action === 'open') {
                    alert('foo');
                }
            };

            // populate the user list combobox
            dataService.getUserList(function(result, err) {
                $scope.user_list = result;
            });

            $timeout(function() {
                $('[data-toggle="tooltip"]').tooltip({
                    'placement': 'top'
                });
            });

            $scope.quickSearch = function(is_search_archive) {
                $scope.dataLoaded = false;
                if (is_search_archive) {
                    $scope.search_params.status = 21;
                }

                dataService.findUserTaskWithOptions($scope.search_params, function(result, err) {
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
                if (mode === 'archived') {
                    loadArchivedGrid();
                } else {
                    loadGrid();
                }
            };

        }
    ])
    .controller('taskViewController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        '$routeParams',
        'dataService',
        function($scope, $timeout, $http, $location, $routeParams, dataService) {
            var task_id = $routeParams.id;
            dataService.getTaskById(task_id, function(result, err) {
                $scope.task = result;
                if (err !== undefined) {
                    dataService.showDatabaseErrorMessage($bootbox);
                }
            });
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
            dataService.set('task_to_edit', null);
            $scope.user_list = [];
            $scope.dt = $scope.task.due_date;
            $scope.buttonDisabled = false;

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
                $scope.buttonDisabled = true;
                $http.post(dataService.getApiUrl('/api/task/update'), $scope.task)
                    .then(function(result) {
                        if (result.data.message !== 'success') {
                            throw result.data;
                        }
                        // display successfully alert
                        $scope.showAlert = true;
                        $scope.alertType = 'success';
                        $scope.alertMsg = 'Task updated successfully. Redirecting to dashboard now...';
                        $timeout(function() {
                            $location.path('/');
                        }, 2000);
                    })
                    .catch(function(err) {
                        $scope.showAlert = true;
                        $scope.alertType = 'danger';
                        if (err.message === 'error_modified') {
                            $scope.alertMsg = 'Error: someone had just updated the task before you, please reload this page and try to update again. Going back to dashboard now...';
                            $timeout(function() {
                                $location.path('/');
                            }, 5000);
                        } else {
                            $scope.alertMsg = 'Error creating a new task!';
                        }
                        $scope.buttonDisabled = false;
                        console.log(err);
                    });
            };
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
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';

            $scope.minDate = new Date();

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

            var validate = function() {
                if (moment().isBefore(moment($scope.task.due_date)) || moment().isSame(moment($scope.task.due_date), 'day')) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.submit = function() {
                if (validate()) {
                    $http.post(dataService.getApiUrl('/api/task/new'), $scope.task)
                        .then(function(result) {
                            if (result.data.message !== 'success') {
                                throw result.data;
                            }
                            // display successfully alert
                            $scope.showAlert = true;
                            $scope.alertType = 'success';
                            $scope.alertMsg = 'New task added successfully. Redirecting to dashboard now...';
                            $timeout(function() {
                                $location.path('/');
                            }, 2000);
                        }).
                    catch(function(err) {
                        $scope.showAlert = true;
                        $scope.alertType = 'danger';
                        $scope.alertMsg = 'Error creating a new task!';
                        $('#create_task_button').removeAttr('disabled');
                        console.log(err);
                    });
                } else {
                    $scope.showAlert = true;
                    $scope.alertType = 'danger';
                    $scope.alertMsg = 'Due date must be after or equal today';
                    $('#create_task_button').removeAttr('disabled');
                }
            };

            $scope.reset = function() {
                $scope.task = {};
            };
        }
    ]);