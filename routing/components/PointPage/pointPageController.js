angular.module('pointPageApp', ['LocalStorageModule'])
// .controller('pointPageController', ['pageForPoint', function (pageForPoint) {
    .controller('pointPageController', ['$window', '$http', '$scope', 'localStorageService', function ($window, $http, $scope, localStorageService) {

        var self = this;

        // let serverUrl = "http://localhost:8080/";

        // $http.defaults.headers.common['x-access-token'] = localStorageService.get('token');
        // $window.onload = function() {
        //     self.pointSelected = $window.pointData.point;
        //     self.pointReviews = $window.pointData.lastReviews;
        // };
        self.pointSelected = $window.pointSelected;
        // console.log($scope.$parent.pointSelected);
        // $scope.$on('pointSelected-update', function (event, args) {
        //     self.pointSelected = args.pointSelected;
        //     console.log($scope.pointSelected);
        //     // do what you want to do
        // });
        // self.pointReviews = $window.pointReviews;

        // self.get2LatestReviews = function () {
        //     $http.get(serverUrl + "reviews/2Latest/pointId/" + self.pointSelected.pointId)
        //     // $http.get(serverUrl + "reviews/2Latest/pointId/5")
        //         .then(function (response) {
        //             self.pointReviews = response.data;
        //         }, function (response) {
        //             //Second function handles error
        //             console.log("Something went wrong with bringing 2 latest reviews ");
        //         });
        //
        // };
        //
        // self.get2LatestReviews();

        /*let pointData = localStorageService.get('pointsSelected').sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateSelected) - new Date(a.dateSelected);
        })[0];
        self.pointSelected = pointData.point;
        self.pointReviews = pointData.pointReviews;
        */

    }]);

