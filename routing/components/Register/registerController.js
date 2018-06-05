angular.module('pointsOfInterestApp')
    .controller('registerController', ['$scope', function ($scope) {
        var self = this;

        self.user={};

        self.countries = ["Israel", "Spain", "USA"];

        self.categories = ["Club", "Art", "Attraction"];
        self.user.categories = []; //selected categories

        // toggle selection for a given category
        self.toggleCategorySelection = function (cName) {
            let idx = self.user.categories.indexOf(cName);
            if (idx > -1) {
                self.user.categories.splice(idx, 1);
            }
            else {
                self.user.categories.push(cName);
            }
        };

        self.submit = function () {
            console.log('User clicked submit with ', self.user);
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);