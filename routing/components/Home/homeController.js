angular.module('pointsOfInterestApp')
// .controller('homeController', ['$scope', function ($scope) {
    .controller('homeController', ['$scope', '$location', '$http', 'setHeadersToken', 'localStorageModel', 'loggedInUsername', function ($scope, $location, $http, setHeadersToken, localStorageModel, loggedInUsername) {
        let self = this;

        self.user = {};

        self.user.username = loggedInUsername.username;

        self.directToPOI = function () {
            $location.path('/poi')
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);