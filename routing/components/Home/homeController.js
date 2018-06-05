angular.module('pointsOfInterestApp')
.controller('homeController', ['$scope', function($scope) {
    $scope.count = 0;
    $scope.myFunc = function() {
      $scope.count++;
    };
  }]);