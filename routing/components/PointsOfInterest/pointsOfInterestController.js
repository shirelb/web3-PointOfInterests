angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['pageForPoint','$scope', '$window', '$http','$location', function (pageForPoint,$scope, $window, $http,$location) {
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

        self.OpenPointPage = function (point) {
            //$window.open($lo);
            self.selected = point;
            pageForPoint.set(self.selected);
            console.log("loggg: "+self.selected.name);
            // $location.path('/pointPage');
            // $window.open('#/pointPage');
            $window.open("components/PointPage/pointPage.html",'_blank').pointSelected=self.selected;
            // $window.open("components/PointPage/pointPage.html", "", "width=500,height=500");
            /*var myWindow = $window.open("", self.selected, "width=500,height=500");
            myWindow.document.write("<body><p>"+ point.name +"</p><br>"+
                                    "<p>"+point.description+"</p>" +
                                    "<div><button-favorite></button-favorite></div>" +"</body>"
            );
            var poiImage = myWindow.document.createElement("IMG");
            poiImage.setAttribute("src",point.image);
            myWindow.document.body.appendChild(poiImage);
            var x = myWindow.document.createElement("button-favorite");
            //x.setAttribute("src",point.image);
            myWindow.document.body.appendChild(x);*/
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

        self.getAllCategories = function() {
            
            let serverUrl = "http://localhost:8080/";
            $http.get(serverUrl + "categories/")
                .then(function (response) {
                    //First function handles success
                    self.getAllCategories = response.data;
                    self.categories = response.data;
                  
                    console.log("getting all categories" + self.categories);

                }, function (response) {
                    self.getAllCategories.content = response.data;
                    console.log("getting all categories faild");
                    self.message = "Something went wrong with getting all categories of interests"
                });

        };

        self.getPointsByCategory = function(cat) {           
            let serverUrl = "http://localhost:8080/";
            $http.get(serverUrl + "pointsOfInterests/category/"+cat)
                .then(function (response) {
                    //First function handles success
                    self.getAllCategories = response.data;
                    self.filetrPoints = response.data;
                  
                    console.log("getting the categories of this category" + self.fiterPoints);

                }, function (response) {
                    self.getPointsByCategory.content = response.data;
                    console.log("getting all categories faild");
                    self.message = "Something went wrong with getting all categories of interests"
                });

        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
        self.getAllPoints();
        self.getAllCategories();
    }]);

    