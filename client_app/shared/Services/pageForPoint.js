angular.module('pointsOfInterestApp')
    .service('pageForPoint', ['$location', '$http', function ($location, $http) {
        var self = this;
        self.point = null;
        self.token = null;

        self.set = function (point, t) {
            self.point = point;
            if(self.token===null){
                $http.defaults.headers.common['x-access-token'] = t;
                console.log("set2")
            }else{
                self.point = point;
            }
        };

        self.setTokenForPointPage = function (t) {
            token = t;
            self.username = t.username;
            $http.defaults.headers.common['x-access-token'] = t;
            console.log("set")

        };


    }]);

