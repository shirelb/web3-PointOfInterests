angular.module('pointsOfInterestApp')
    .controller('indexController','setHeadersToken', [function (setHeadersToken) {
        self = this;

        self.userName = setHeadersToken.userName

        self.hello = true;

        self.flipHello = function () {
            self.hello = !self.hello
        };

        self.checkNumber = function (number) {
            if (number % 2 == 0)
                return true
            else
                return false
        };

    }]);
