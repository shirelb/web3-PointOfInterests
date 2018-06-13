angular.module('pointPageApp',[])
    // .controller('pointPageController', ['pageForPoint', function (pageForPoint) {
    .controller('pointPageController', ['$window', '$http', function ($window, $http) {

        var self = this;

        self.pointSelected = $window.pointSelected;
        
        

    }]);

