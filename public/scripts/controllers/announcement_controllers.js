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
            $scope.model.expired_date = moment().add(3, 'days').valueOf();
            $scope.showAlert = false;
            $scope.alertType = 'success';
            $scope.alertMsg = '';

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.opened) $scope.opened = false;
                else
                    $scope.opened = true;
            };

            $scope.reset = function() {
                $scope.model = {};
            };

            $scope.submit = function() {
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
                        $('#create_button').removeAttr('disabled');
                    });
            }
        }
    ]);



