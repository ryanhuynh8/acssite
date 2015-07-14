angular.module('themeApp.controllers')
    /* route setup */
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/announcements/new', {
                templateUrl: 'views/announcement_new.html'
            });
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

            $scope.delete = function(id) {
                console.log(id);
            }
        }
    ])
    .controller('announcementCreateController', [
        '$scope',
        '$timeout',
        '$http',
        '$location',
        'dataService',
        function($scope, $timeout, $http, $location, dataService) {
            $scope.model = {};
            $scope.model.post_on_date = moment().valueOf();
            $scope.model.expired_date = moment().add(3, 'days').valueOf();
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';

            $scope.open1 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.opened1) $scope.opened1 = false;
                else
                    $scope.opened1 = true;
            };

            $scope.open2 = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if ($scope.opened2) $scope.opened2 = false;
                else
                    $scope.opened2 = true;
            };

            $scope.reset = function() {
                $scope.model = {};
            };

            var validate = function() {
                var post_on_before_expired_date = moment($scope.model.post_on_date).isBefore($scope.model.expired_date),
                    valid_post_on_date = moment().isBefore(moment($scope.model.post_on_date)) || moment().isSame(moment($scope.model.post_on_date), 'day'),
                    require_description = ($scope.model.task_description !== '') && ($scope.model.task_description !== undefined);

                if (post_on_before_expired_date && valid_post_on_date && require_description) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.submit = function() {
                if (validate())
                {
                    $http.post(dataService.getApiUrl('/api/announcement/new'), $scope.model)
                        .then(function(result) {
                            if (result.data.message !== 'success'){
                                throw result.data;
                            }
                            // display successfully alert
                            $scope.showAlert = true;
                            $scope.alertType = 'success';
                            $scope.alertMsg = 'New announcement added successfully. Redirecting to dashboard now...';
                            $timeout(function() {
                                $location.path('/');
                            }, 2000)
                        }).
                        catch(function(err) {
                            $scope.showAlert = true;
                            $scope.alertType = 'danger';
                            $scope.alertMsg = 'Error creating a new announcement!';
                            console.log(err);
                            $('#create_button').removeAttr('disabled');
                        });
                } else {
                    $scope.showAlert = true;
                    $scope.alertType = 'danger';
                    $scope.alertMsg = 'Invalid date or empty description.';
                    $('#create_button').removeAttr('disabled');
                }

            }
        }
    ]);



