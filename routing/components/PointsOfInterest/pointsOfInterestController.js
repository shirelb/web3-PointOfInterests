angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['$scope', '$window', function ($scope, $window) {
        let self = this;

        self.points = {
            1: {
                name: "Paris",
                state: "France",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
            }
            ,
            2: {
                name: "Jerusalem",
                state: "Israel",
                image: "https://cdni.rt.com/files/2017.12/article/5a3fe04efc7e93cd698b4567.jpg"
            }
            ,
            3: {
                name: "London",
                state: "England",
                image: "http://www.ukguide.co.il/Photos/England/London/British-Royal-Tour.jpg"
            }
        };

        self.selectedCity = function (id) {

            console.log(self.selected)
        };

        self.addToCart = function (id, city) {

            console.log(id);
            console.log(city);
            console.log(self.amount[id])


        };

        self.OpenPointPage = function () {
            $window.open($lo);
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);