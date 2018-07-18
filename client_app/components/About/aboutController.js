angular.module('pointsOfInterestApp')
.controller('aboutController', ['$scope', function($scope) {
    $scope.count = 0;
    $scope.myFunc = function() {
      $scope.count++;
    };
  }]);