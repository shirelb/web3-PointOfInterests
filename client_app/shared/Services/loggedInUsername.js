angular.module('pointsOfInterestApp')
    .service('loggedInUsername', ['setHeadersToken', function (setHeadersToken) {
        this.username = "Guest";

        this.set = function (username) {
            this.username = username;
            console.log("set loggedInUsername")
        };


    }]);

