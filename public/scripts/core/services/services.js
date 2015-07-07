angular
    .module('theme.core.services', [])
    .factory('progressLoader', function() {
        'use strict';
        return {
            start: function() {
                angular.element.skylo('start');
            },
            set: function(position) {
                angular.element.skylo('set', position);
            },
            end: function() {
                angular.element.skylo('end');
            },
            get: function() {
                return angular.element.skylo('get');
            },
            inch: function(amount) {
                angular.element.skylo('show', function() {
                    angular.element(document).skylo('inch', amount);
                });
            }
        };
    })
    .factory('EnquireService', ['$window', function($window) {
        'use strict';
        return $window.enquire;
    }])
    .factory('pinesNotifications', ['$window', function($window) {
        'use strict';
        return {
            notify: function(args) {
                args.mouse_reset = false;
                var notification = new $window.PNotify(args);
                notification.notify = notification.update;
                return notification;
            }
        };
    }])
    .factory('$bootbox', ['$modal', '$window', function($modal, $window) {
        'use strict';
        // NOTE: this is a workaround to make BootboxJS somewhat compatible with
        // Angular UI Bootstrap in the absence of regular bootstrap.js
        if (angular.element.fn.modal === undefined) {
            angular.element.fn.modal = function(directive) {
                var that = this;
                if (directive === 'hide') {
                    if (this.data('bs.modal')) {
                        this.data('bs.modal').close();
                        angular.element(that).remove();
                    }
                    return;
                } else if (directive === 'show') {
                    return;
                }

                var modalInstance = $modal.open({
                    template: angular.element(this).find('.modal-content').html()
                });
                this.data('bs.modal', modalInstance);
                setTimeout(function() {
                    angular.element('.modal.ng-isolate-scope').remove();
                    angular.element(that).css({
                        opacity: 1,
                        display: 'block'
                    }).addClass('in');
                }, 100);
            };
        }

        return $window.bootbox;
    }])
    .service('lazyLoad', ['$q', '$timeout', function($q, $t) {
        'use strict';
        var deferred = $q.defer();
        var promise = deferred.promise;
        this.load = function(files) {
            angular.forEach(files, function(file) {
                if (file.indexOf('.js') > -1) { // script
                    (function(d, script) {
                        var fDeferred = $q.defer();
                        script = d.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.onload = function() {
                            $t(function() {
                                fDeferred.resolve();
                            });
                        };
                        script.onerror = function() {
                            $t(function() {
                                fDeferred.reject();
                            });
                        };

                        promise = promise.then(function() {
                            script.src = file;
                            d.getElementsByTagName('head')[0].appendChild(script);
                            return fDeferred.promise;
                        });
                    }(document));
                }
            });

            deferred.resolve();

            return promise;
        };
    }])
    .service('dataService', ['$http', function($http) {
        var data = {};
        var HOST_URL = 'http://acsdemo-yuhuynh.c9.io';


        var processResultExtractName = function(result) {
            angular.forEach(result, function(row) {
                if (row.poster)
                    row.poster_fullname = row.poster.first_name + ' ' + row.poster.last_name;
                else
                    return "none";

                if (row.assignee)
                    row.assignee_fullname = row.assignee.first_name + ' ' + row.assignee.last_name;
                else
                    return "none";
            });
        };

        this.get = function(key) {
            return data[key];
        };

        this.set = function(key, value) {
            data[key] = value;
        };

        this.getApiUrl = function(path_to_api) {
            return HOST_URL + path_to_api;
        };

        this.showDatabaseErrorMessage = function(bootbox) {
            bootbox.alert({
                size: 'small',
                message: '<span style="color:red">There was an error connecting to the database. Please contact your system administrator to resolve this issue.</span>'
            });
        }

        this.getUserListFullInfo = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/user/list_fullinfo')
                .success(function(data) {
                    result = data;
                    angular.forEach(result, function(user) {
                        if (user.middle_name)
                            user.full_name = user.first_name + ' ' + user.middle_name + ' ' + user.last_name;
                        else
                            user.full_name = user.first_name + ' ' + user.last_name;
                    });
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getUserList = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/user/list/')
                .success(function(data) {
                    result = [];
                    data.forEach(function(c, i, a) {
                        var user_info = {
                            id: c.id,
                            full_name: c.first_name + ' ' + c.last_name
                        };
                        result.push(user_info);
                    });
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getAnnoucementList = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/announcement/list')
                .success(function(data) {
                    result = data;
                    result.forEach(function(item, index, array) {
                        item.heading = "posted on " + moment(item.post_on_date).format('LLLL');
                    });
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getTaskByUser = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/task/list/')
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getArchivedTaskByUser = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/task/list/archived')
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getAllTask = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/task/all/list')
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.getAllArchivedTask = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/task/all/archived')
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.findUserTaskWithOptions = function(params, cb) {
            var result, err;
            $http.post(HOST_URL + '/api/task/search', params)
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };

        this.findTaskWithOptions = function(params, cb) {
            var result, err;
            $http.post(HOST_URL + '/api/task/all/search', params)
                .success(function(data) {
                    result = data;
                    processResultExtractName(result);
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        };
    }])
    .filter('safe_html', ['$sce', function($sce) {
        'use strict';
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }])
    .filter('taskStatusFilter', function() {
        return function(value) {
            if (value === 19)
                return 'In-Progress';
            else
                return 'Not done';
        };
    })
    .filter('readStatusFilter', function() {
        return function(value) {
            if (value === true)
                return 'Yes';
            else
                return 'No';
        };
    })
    .filter('sexFilter', function() {
        return function(value) {
            if (value === true)
                return 'F';
            else
                return 'M';
        };
    })
    .filter('employeeTypeFilter', function() {
        return function(value) {
            if (value === 0)
                return 'A'
            else
                return 'B'
        };
    });