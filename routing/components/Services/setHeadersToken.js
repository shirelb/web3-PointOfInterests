angular.module('pointsOfInterestApp')
    .service('setHeadersToken', ['$http', function ($http) {
        this.username = null;

        this.set = function (t) {
            token = t;
            this.username = t.username;
            $http.defaults.headers.common['x-access-token'] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        };


    }]);

