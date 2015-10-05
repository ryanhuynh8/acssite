angular.module('theme.core.services')
    .service('dataService', ['$http', function($http) {
        var data = {};
        var HOST_URL = 'https://acsdemo-yuhuynh.c9.io';


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
        };

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

        this.getTaskById = function(id, cb) {
            var result, err;
            $http.get(HOST_URL + '/api/task/' + id)
                .success(function(data) {
                    result = data;
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

        this.logOut = function(cb) {
            $http.get(HOST_URL + '/api/logout')
                .success(function(data){
                    cb();
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
    }]);
