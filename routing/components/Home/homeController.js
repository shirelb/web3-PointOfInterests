angular.module('pointsOfInterestApp')
// .controller('homeController', ['$scope', function ($scope) {
    .controller('homeController', ['$scope', '$location', '$http', 'setHeadersToken', 'localStorageModel', function ($scope, $location, $http, setHeadersToken, localStorageModel) {
        let self = this;

        self.user = {};

        if (setHeadersToken.username === null) {
            self.user.username = "Guest";
            console.log(self.user.username);
        }
        else {
            self.user.username = setHeadersToken.username;
            console.log(self.user.username);
        }

        self.directToPOI = function () {
            $location.path('/poi')
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);