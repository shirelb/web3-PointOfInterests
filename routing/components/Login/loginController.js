angular.module('pointsOfInterestApp')
.controller('loginController', ['$scope', function($scope) {
    var self = this;

    self.submit = function () {
        console.log('User clicked submit with ', self.user);
    };

    $scope.count = 0;
    $scope.myFunc = function() {
      $scope.count++;
    };
  }]);