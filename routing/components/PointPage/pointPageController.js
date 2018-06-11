angular.module('pointsOfInterestApp')
    .controller('pointController', ['pageForPoint', function (pageForPoint) {

        var self = this;

        this.selected = pageForPoint.point;

        

    }]);

