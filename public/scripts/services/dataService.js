angular.module('theme.core.services')
    .service('dataService', ['$http', function($http) {
        var data = {};
        var HOST_URL = 'https://acsdemo-yuhuynh.c9.io';
        // var HOST_URL = 'http://localhost:8080';

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

        this.getLastTicketId = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/ticket/last_id')
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

        this.getBuilderIndex = function(builder_id, cb){
            var result, err;
            $http.get(HOST_URL + '/api/builder/index/' + builder_id)
                .success(function(data){
                    result = data;
                })
                .catch(function(error)
                {
                    err = error;
                })
                .finally(function(){
                    cb(result, err);
                });
        }

        this.getAllTicket = function(cb) {
          var result, err;
          $http.get(HOST_URL + '/api/tickets')
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

        this.getCustomerList = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/customer/list')
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

        this.findCustomerWithOptions = function(params, cb) {
            var result, err;
            $http.post(HOST_URL + '/api/customer/search', params)
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

        this.findTicket = function(params, cb){
            var result, err;
            $http.post(HOST_URL + '/api/ticket/search', params)
                .success(function(data) {
                    result = data;
                })
                .catch(function(error) {
                    err = error;
                }).
                finally(function() {
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

        this.getUnitFromCustomerId = function(id, cb)
        {
            var result, err;
            $http.get(HOST_URL + '/api/customer/unit/' + id)
                .success(function(data) {
                    result = data;
                })
                .catch(function(error) {
                    err = error;
                })
                .finally(function() {
                    cb(result, err);
                });
        }

        this.getBuilderList = function(cb) {
            var result, err;
            $http.get(HOST_URL + '/api/builder/list/')
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

        this.getListOfStates = function() {
            return [
            {
                "name": "Alabama",
                "abbreviation": "AL"
            },
            {
                "name": "Alaska",
                "abbreviation": "AK"
            },
            {
                "name": "Arizona",
                "abbreviation": "AZ"
            },
            {
                "name": "Arkansas",
                "abbreviation": "AR"
            },
            {
                "name": "California",
                "abbreviation": "CA"
            },
            {
                "name": "Colorado",
                "abbreviation": "CO"
            },
            {
                "name": "Connecticut",
                "abbreviation": "CT"
            },
            {
                "name": "Delaware",
                "abbreviation": "DE"
            },
            {
                "name": "District Of Columbia",
                "abbreviation": "DC"
            },
            {
                "name": "Florida",
                "abbreviation": "FL"
            },
            {
                "name": "Georgia",
                "abbreviation": "GA"
            },
            {
                "name": "Hawaii",
                "abbreviation": "HI"
            },
            {
                "name": "Idaho",
                "abbreviation": "ID"
            },
            {
                "name": "Illinois",
                "abbreviation": "IL"
            },
            {
                "name": "Indiana",
                "abbreviation": "IN"
            },
            {
                "name": "Iowa",
                "abbreviation": "IA"
            },
            {
                "name": "Kansas",
                "abbreviation": "KS"
            },
            {
                "name": "Kentucky",
                "abbreviation": "KY"
            },
            {
                "name": "Louisiana",
                "abbreviation": "LA"
            },
            {
                "name": "Maine",
                "abbreviation": "ME"
            },
            {
                "name": "Maryland",
                "abbreviation": "MD"
            },
            {
                "name": "Massachusetts",
                "abbreviation": "MA"
            },
            {
                "name": "Michigan",
                "abbreviation": "MI"
            },
            {
                "name": "Minnesota",
                "abbreviation": "MN"
            },
            {
                "name": "Mississippi",
                "abbreviation": "MS"
            },
            {
                "name": "Missouri",
                "abbreviation": "MO"
            },
            {
                "name": "Montana",
                "abbreviation": "MT"
            },
            {
                "name": "Nebraska",
                "abbreviation": "NE"
            },
            {
                "name": "Nevada",
                "abbreviation": "NV"
            },
            {
                "name": "New Hampshire",
                "abbreviation": "NH"
            },
            {
                "name": "New Jersey",
                "abbreviation": "NJ"
            },
            {
                "name": "New Mexico",
                "abbreviation": "NM"
            },
            {
                "name": "New York",
                "abbreviation": "NY"
            },
            {
                "name": "North Carolina",
                "abbreviation": "NC"
            },
            {
                "name": "North Dakota",
                "abbreviation": "ND"
            },
            {
                "name": "Ohio",
                "abbreviation": "OH"
            },
            {
                "name": "Oklahoma",
                "abbreviation": "OK"
            },
            {
                "name": "Oregon",
                "abbreviation": "OR"
            },
            {
                "name": "Pennsylvania",
                "abbreviation": "PA"
            },
            {
                "name": "Rhode Island",
                "abbreviation": "RI"
            },
            {
                "name": "South Carolina",
                "abbreviation": "SC"
            },
            {
                "name": "South Dakota",
                "abbreviation": "SD"
            },
            {
                "name": "Tennessee",
                "abbreviation": "TN"
            },
            {
                "name": "Texas",
                "abbreviation": "TX"
            },
            {
                "name": "Utah",
                "abbreviation": "UT"
            },
            {
                "name": "Vermont",
                "abbreviation": "VT"
            },
            {
                "name": "Virginia",
                "abbreviation": "VA"
            },
            {
                "name": "Washington",
                "abbreviation": "WA"
            },
            {
                "name": "West Virginia",
                "abbreviation": "WV"
            },
            {
                "name": "Wisconsin",
                "abbreviation": "WI"
            },
            {
                "name": "Wyoming",
                "abbreviation": "WY"
            }
          ];
        };
    }]);


