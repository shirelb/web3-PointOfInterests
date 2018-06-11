angular.module('pointsOfInterestApp')
    .service('pageForPoint', ['pointsOfInterestController', function (pointsOfInterestController) {
        
        self = this;

        this.set = function (point){
            this.point = point;

        };


    }]);

