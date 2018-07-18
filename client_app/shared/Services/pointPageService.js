angular.module('pointsOfInterestApp')
    .service('pointPageService', ['$location', '$http', function ($location, $http) {
        var self = this;

        self.point = null;

        self.set = function (point) {
            self.point = point;
            if (self.token === null) {
                console.log("set2")
            } else {
                self.point = point;
            }
        };

    }]);

