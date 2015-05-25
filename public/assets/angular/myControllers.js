yukonApp
    .controller('mainCtrl', [
        '$scope',
        function($scope) {}
    ])
    .controller('loginCtrl', [
        '$scope',
        '$timeout',
        '$http',
        '$state',
        function($scope, $timeout, $http, $state) {
            $scope.loginForm = true;
            $scope.switchForm = function(form) {
                $scope.loginForm = !$scope.loginForm;
                $('.form_wrapper').removeClass('fadeInUpBig');
                $timeout(function() {
                    $('.form_wrapper').removeClass('fadeOutDownBig').hide();
                    $('#' + form).show().addClass('fadeInUpBig');
                }, 300)
            }

            $scope.login = function() {
                var request = '/api/auth/' + $scope.user.user_name + '/' + $scope.user.password;
                $http.post(request).success(function(res) {
                    if (res.message) {
                        if (res.message === "authorized") {
                            $state.go('auth.home');
                        }
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            }
        }
    ])
    .controller('sideMenuCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$timeout',
        '$http',
        function($rootScope, $scope, $state, $stateParams, $timeout, $http) {
            var n = 0;
            $scope.sections = [{
                id: n,
                title: 'Dashboard',
                icon: 'icon_house_alt first_level_icon',
                link: 'auth.home'
            }, {
                id: n++,
                title: 'Tasks',
                icon: 'icon_document_alt first_level_icon',
                link: 'auth.tasks'
            }, {
                id: n++,
                title: 'Forms',
                icon: 'icon_document_alt first_level_icon',
                submenu_title: 'Forms',
                submenu: [{
                    title: 'Regular Elements',
                    link: 'auth.forms.regular_elements'
                }, {
                    title: 'Extended Elements',
                    link: 'auth.forms.extended_elements'
                }, {
                    title: 'Gridforms',
                    link: 'auth.forms.gridform'
                }, {
                    title: 'Validation',
                    link: 'auth.forms.validation'
                }, {
                    title: 'Wizard',
                    link: 'auth.forms.wizard'
                }]
            }, {
                id: n++,
                title: 'Pages',
                icon: 'icon_folder-alt first_level_icon',
                badge: true,
                submenu_title: 'Pages',
                submenu: [{
                    title: 'Chat',
                    link: 'auth.pages.chat'
                }, {
                    title: 'Contact List',
                    link: 'auth.pages.contactList'
                }, {
                    title: 'Error 404',
                    link: 'error.404'
                }, {
                    title: 'Help/Faq',
                    link: 'auth.pages.helpFaq.all'
                }, {
                    title: 'Invoices',
                    link: 'auth.pages.invoices'
                }, {
                    title: 'Login Page',
                    link: 'login'
                }, {
                    title: 'Login Page 2',
                    link: 'login2'
                }, {
                    title: 'Mailbox',
                    link: 'auth.pages.mail.inbox'
                }, {
                    title: 'Mailbox (compose)',
                    link: 'auth.pages.mail.compose'
                }, {
                    title: 'Search Page',
                    link: 'auth.pages.search'
                }, {
                    title: 'User List',
                    link: 'auth.pages.userList'
                }, {
                    title: 'User Profile',
                    link: 'auth.pages.userProfile'
                }, {
                    title: 'User Profile 2',
                    link: 'auth.pages.userProfile2'
                }]
            }, {
                id: n++,
                title: 'Components',
                icon: 'icon_puzzle first_level_icon',
                submenu_title: 'Components',
                submenu: [{
                        title: 'Gallery',
                        link: 'auth.components.gallery'
                    }, {
                        title: 'Grid',
                        link: 'auth.components.grid'
                    }, {
                        title: 'Icons',
                        link: 'auth.components.icons'
                    }, {
                        title: 'Notifications/Popups',
                        link: 'auth.components.notificationsPopups'
                    }, {
                        title: 'UI Bootstrap',
                        link: 'auth.components.bootstrapUI'
                    }, {
                        title: 'Typography',
                        link: 'auth.components.typography'
                    }

                ]
            }, {
                id: n++,
                title: 'Plugins',
                icon: 'icon_lightbulb_alt first_level_icon',
                badge: true,
                submenu_title: 'Plugins',
                submenu: [{
                    title: 'Ace Editor',
                    link: 'auth.plugins.aceEditor'
                }, {
                    title: 'Calendar',
                    link: 'auth.plugins.calendar.basic'
                }, {
                    title: 'Charts',
                    link: 'auth.plugins.charts'
                }, {
                    title: 'Gantt Chart',
                    link: 'auth.plugins.ganttChart'
                }, {
                    title: 'Google Maps',
                    link: 'auth.plugins.googleMaps'
                }, {
                    title: 'Tables',
                    link: 'auth.plugins.tables.footable'
                }, {
                    title: 'Vector Maps',
                    link: 'auth.plugins.vectorMaps'
                }]
            }];

            // accordion menu
            $(document).off('click', '.side_menu_expanded #main_menu .has_submenu > a').on('click', '.side_menu_expanded #main_menu .has_submenu > a', function() {
                if ($(this).parent('.has_submenu').hasClass('first_level')) {
                    var $this_parent = $(this).parent('.has_submenu'),
                        panel_active = $this_parent.hasClass('section_active');

                    if (!panel_active) {
                        $this_parent.siblings().removeClass('section_active').children('ul').slideUp('200');
                        $this_parent.addClass('section_active').children('ul').slideDown('200');
                    }
                    else {
                        $this_parent.removeClass('section_active').children('ul').slideUp('200');
                    }
                }
                else {
                    var $submenu_parent = $(this).parent('.has_submenu'),
                        submenu_active = $submenu_parent.hasClass('submenu_active');

                    if (!submenu_active) {
                        $submenu_parent.siblings().removeClass('submenu_active').children('ul').slideUp('200');
                        $submenu_parent.addClass('submenu_active').children('ul').slideDown('200');
                    }
                    else {
                        $submenu_parent.removeClass('submenu_active').children('ul').slideUp('200');
                    }
                }
            });

            $rootScope.createScrollbar = function() {
                $("#main_menu .menu_wrapper").mCustomScrollbar({
                    theme: "minimal-dark",
                    scrollbarPosition: "outside"
                });
            }

            $rootScope.destroyScrollbar = function() {
                $("#main_menu .menu_wrapper").mCustomScrollbar('destroy');
            }

            $timeout(function() {
                if (!$rootScope.sideNavCollapsed && !$rootScope.topMenuAct) {
                    if (!$('#main_menu .has_submenu').hasClass('section_active')) {
                        $('#main_menu .has_submenu .act_nav').closest('.has_submenu').children('a').click();
                    }
                    else {
                        $('#main_menu .has_submenu.section_active').children('ul').show();
                    }
                    // init scrollbar
                    $rootScope.createScrollbar();
                }
            });
        }
    ])
    .controller('tasksController', [
        '$scope',
        '$timeout',
        '$http',
        '$state',
        'dataService',
        function($scope, $timeout, $http, $state, dataService) {
            var initGrid = function() {
                $scope.gridOptions = {
                    enableColumnMenus: false,
                    rowHeight: 100,
                    columnDefs: [{
                        field: 'create_on',
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
                dataService.set('task_to_view', row);
            };

            initGrid();
            loadData();
        }
    ])
    .controller('taskViewController', [
        '$scope',
        '$timeout',
        '$http',
        '$state',
        'dataService',
        function($scope, $timeout, $http, $state, dataService) {
            $scope.task = dataService.get('task_to_view');
            console.log(JSON.stringify($scope.task));
        }
    ])