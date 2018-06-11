angular.module('pointPageApp',[])
    // .controller('pointPageController', ['pageForPoint', function (pageForPoint) {
    .controller('pointPageController', ['$window', function ($window) {

        var self = this;

        self.pointSelected = $window.pointSelected;

    }]);

