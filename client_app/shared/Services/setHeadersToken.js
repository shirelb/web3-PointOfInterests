angular.module('pointsOfInterestApp')
    .service('setHeadersToken', ['$http', function ($http) {
        this.token = null;

        this.set = function (t) {
            token = t;
            this.token = t;
            $http.defaults.headers.common['x-access-token'] = t;
            console.log("set");
            console.log("setHeadersToken token: "+ token);
        };


    }]);

