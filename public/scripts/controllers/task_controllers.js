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
            $scope.search_params = {};  // to avoid the DOT notation quirk nature of javascript

            $scope.setLoadMode = function(is_archived) {
                if (is_archived)
                    loadArchivedGrid();
                else
                    loadGrid();
            };

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
                    if (err !== undefined)
                    {
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
                    if (err !== undefined)
                    {
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
                        buttons: {ok:{label: 'OK'}}
                    });
                }
                else if (action === 'edit') {
                    dataService.set('task_to_edit', row.entity);
                    $location.path('/tasks/edit');
                }
            };

            $scope.dataLoaded = false;

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
                if (is_search_archive)
                {
                    $scope.search_params.status = 21;
                }
                dataService.findTaskWithOptions($scope.search_params, function (result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    $scope.showResult = true;
                    $scope.resultMsg = 'Found ' + result.length + ' record(s).';
                    if (err !== undefined)
                    {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            $scope.reset = function() {
                $scope.search_params = {};
                $scope.showResult = false;
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
            $scope.search_params = {};  // to avoid the DOT notation quirk nature of javascript
            $scope.showResult = false;
            $scope.is_archived = false;

            $scope.setLoadMode = function(is_archived) {
                if (is_archived)
                {
                    loadArchivedGrid();
                }
                else
                {
                    loadGrid();
                }
            };

           var loadArchivedGrid = function () {
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
                dataService.getArchivedTaskByUser(function (result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined)
                    {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
            };

            var loadGrid = function() {
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
                    }, {
                        name: ' button',
                        displayName: 'Action',
                        cellTemplate: 'views/grid_template/cell.task.button.template.html',
                        width: 150
                    }],
                    data: [] // HACK: so that the browser won't give a warning complain
                };
                dataService.getTaskByUser(function (result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    if (err !== undefined)
                    {
                        dataService.showDatabaseErrorMessage($bootbox);
                    }
                });
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
                    // note: we are not handling any error here
                    $http.post(dataService.getApiUrl('/api/task/readed'), row.entity);
                    row.entity.readed = true;
                    el.attr('disabled', '');
                }
                else if (action === 'mark_as_completed') {
                    row.entity.task_description = 'Archiving, please wait...';
                    $http.post(dataService.getApiUrl('/api/task/archive'), row.entity)
                        .then(function(result){
                            var index = $scope.gridOptions.data.indexOf(row.entity);
                            $scope.gridOptions.data.splice(index, 1);
                        })
                }
                else if (action === 'view')
                {
                    var msg = '<h4><span style="white-space: pre-line;font-family: Verdana">';
                    msg += row.entity.task_description;
                    msg += '</span></h4>';
                    $bootbox.dialog({
                        size: 'large',
                        title: '<b>Task Detail</b>',
                        message: msg,
                        onEscape: true,
                        buttons: {ok:{label: 'OK'}}
                    });
                }
            };

            $scope.dataLoaded = false;

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
                if (is_search_archive)
                {
                    $scope.search_params.status = 21;
                }

                dataService.findUserTaskWithOptions($scope.search_params, function (result, err) {
                    $scope.gridOptions.data = result;
                    $scope.dataLoaded = true;
                    $scope.showResult = true;
                    $scope.resultMsg = 'Found ' + result.length + ' record(s).';

                    if (err !== undefined)
                    {
                        dataService.showDatabaseErrorMessage($bootbox);;
                    }
                });
            };

            $scope.reset = function() {
                $scope.search_params = {};
                $scope.showResult = false;
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
                // TODO: error handling and concurrency update notification
                $http.post(dataService.getApiUrl('/api/task/update'), $scope.task);
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
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';
            console.log(mainform.$invalid);
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
                if (moment().isBefore(moment($scope.task.due_date)) || moment().isSame(moment($scope.task.due_date)))
                {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.submit = function() {
                if (validate()) {
                    $http.post(dataService.getApiUrl('/api/task/new'), $scope.task)
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
                            $('#create_task_button').removeAttr('disabled');
                        });
                } else {
                    $scope.showAlert = true;
                    $scope.alertType = 'danger';
                    $scope.alertMsg = 'Due date must be after or equal today';
                    $('#create_task_button').removeAttr('disabled');
                }
            }

            $scope.reset = function() {
                $scope.task = {};
            };
        }
    ]);
