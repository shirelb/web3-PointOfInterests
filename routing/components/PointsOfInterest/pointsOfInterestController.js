angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['pageForPoint', '$scope', '$window', '$http', '$location', function (pageForPoint, $scope, $window, $http, $location) {
        let self = this;

        let serverUrl = "http://localhost:8080/";

        self.selectedCity = function (id) {
            console.log(self.selected)
        };

        self.addToCart = function (id, city) {
            console.log(id);
            console.log(city);
            console.log(self.amount[id])
        };


        self.get2LatestReviews = function (point) {
            return $http.get(serverUrl + "reviews/2Latest/pointId/" + point.pointId)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    console.log("Something went wrong with bringing 2 latest reviews ");
                });

        };

        self.addViewToPoint = function (point) {
            return $http.put(serverUrl + "pointsOfInterests/addView", {'pointId': point.pointId})
                .then(function (response) {
                    return {views: point.views + 1};
                }, function (response) {
                    //Second function handles error
                    console.log("Something went wrong with add View To Point ");
                });
        };

        self.OpenPointPage = function (point) {
            //$window.open($lo);
            // self.point = point;
            self.selected = point;
            let pointWindow = $window.open("components/PointPage/pointPage.html", '_blank');
            pointWindow.pointData = {
                'point': self.selected,
                'lastReviews': []
            };

            self.addViewToPoint(point)
                .then(function (result) {
                    if (result.views !== undefined) {
                        self.selected.views = result.views;
                        self.get2LatestReviews(point)
                            .then(function (reviews) {
                                pointWindow.pointData = {
                                    'point': self.selected,
                                    'lastReviews': reviews
                                };
                            });
                    }
                });


            /*$http.put(serverUrl + "pointsOfInterests/addView/" + point.pointId)
                .then(function (response) {

                    console.log("views increased successfuly: " + point.views);

                    self.get2LatestReviews(point)
                        .then(function (response) {
                                self.selected = point;
                                // let promise = self.get2LatestReviews(point);
                                // promise.then(function (response) {

                                pageForPoint.set(self.selected);
                                console.log("loggg: " + self.selected.name);
                                // $location.path('/pointPage');
                                // $window.open('#/pointPage');
                                $window.open("components/PointPage/pointPage.html", '_blank').pointSelected = self.selected;

                            }
                        );

                }, function (response) {
                    console.log("Something went wrong with increasing views" + point.pointId);
                    self.message = "Something went wrong withincreasing views"
                });
*/
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

        self.getAllPoints = function () {

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

        self.getAllCategories = function () {

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

        self.getPointsByCategory = function (cat) {
            $http.get(serverUrl + "pointsOfInterests/category/" + cat)
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


        /*self.openTheWindow = function () {
            //console.log("windoe.oprn//// null? "+ ($window.open("components/PointPage/pointPage.html",'_blank')===null));
            $window.open("components/PointPage/pointPage.html", '_blank').pointSelected = self.selected;
            console.log("ssss: " + self.selected.review1);
        };*/

        self.getAllPoints();
        self.getAllCategories();
    }]);

    