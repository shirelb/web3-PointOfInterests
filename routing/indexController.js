angular.module('pointsOfInterestApp')
    // .controller('indexController', ['$location', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $http, setHeadersToken, localStorageModel) {
    .controller('indexController', ['$scope', function ($scope) {
        self = this;

        self.hello = true;

        self.flipHello = function () {
            self.hello = !self.hello;
        };

        self.checkNumber = function (number) {
            if (number % 2 == 0)
                return true;
            else
                return false;
        };

    }]);
