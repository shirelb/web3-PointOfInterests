angular.module('pointsOfInterestApp')
    .service('pageForPoint', ['$location', function ($location) {

        this.point = null;

        this.set = function (point) {
            this.point = point;
        };


    }]);

