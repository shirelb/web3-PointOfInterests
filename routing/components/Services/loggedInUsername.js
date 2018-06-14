angular.module('pointsOfInterestApp')
    .service('loggedInUsername', ['setHeadersToken', function (setHeadersToken) {
        this.username = "Guest";

        this.set = function (username) {
            this.username = username;
            console.log("set loggedInUsername")
        };

        /*this.get = function () {
            if (setHeadersToken.token === null) {
                this.username = "Guest";
                console.log(this.username);
            }
            else {
                 this.username;
            }
        }*/

    }]);

