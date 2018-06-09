angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
        let self = this;

        
        /*self.points = {
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
        };*/


        self.selectedCity = function (id) {

            console.log(self.selected)
        };

        self.addToCart = function (id, city) {

            console.log(id);
            console.log(city);
            console.log(self.amount[id])


        };

        self.OpenPointPage = function () {
            //$window.open($lo);
        };

        self.getAllPoints = function() {
            
            let serverUrl = "http://localhost:8080/";
            $http.get(serverUrl + "pointsOfInterests/")
                .then(function (response) {
                    //First function handles success
                    self.getAllPoints.content = response.data;
                    self.points = response.data;
                  
                    console.log("getting all points" + self.points);

                }, function (response) {
                    self.getAllPoints.content = response.data;
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                    console.log("getting all points faild");
                    self.message = "Something went wrong with getting all points of interests"
                });

        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
        self.getAllPoints();
    }]);

    