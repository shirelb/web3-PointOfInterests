angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['pageForPoint', '$scope', '$window', '$http', 'localStorageModel', '$rootScope', '$q','favoritesPointsService','reviewPointsService','loggedInUsername', function (pageForPoint, $scope, $window, $http, localStorageModel, $rootScope, $q,favoritesPointsService,reviewPointsService,loggedInUsername) {
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
            self.selected = point;
            let pointWindow = $window.open("client_app/components/PointPage/pointPage.html", '_blank');
            self.selected.lastReviews = [];
            // self.selected.lastReviews = self.pointsLastReviews.filter(function (obj) {
            //     if (obj !== undefined)
            //         return obj.pointId === point.pointId;
            // });
            pointWindow.pointSelected = self.selected;

            // pointWindow.pointsLastReviews = self.pointsLastReviews;
            // pointWindow.pointSelected = self.selected;
            pointWindow.favService = favoritesPointsService;
            pointWindow.reviewService = reviewPointsService;
            // pointWindow.get2LatestReviews = self.get2LatestReviews;

            pointWindow.isLoggedIn = loggedInUsername.username !== "Guest";
            pointWindow.parentWindowName="pointsOfInterest";

            self.addViewToPoint(point)
                .then(function (result) {
                    if (result.views !== undefined) {
                        self.selected.views = result.views;
                    }
                });

            reviewPointsService.get2LatestReviews(point)
                .then(function (result) {
                    // self.selected.lastReviews = [];
                    // self.selected.lastReviews = result;

                    pointWindow.lastReviews = [];
                    pointWindow.lastReviews = result;
                });
        };

        self.getPointsLastReviews = function (pois, poisReaviews) {
            poisReaviews = [];
            let arr = [];

            for (let i = 0; i < pois.length; i++) {
                arr.push($http.get(serverUrl + "reviews/2Latest/pointId/" + pois[i].pointId));
            }

            return $q.all(arr)
                .then(function (results) {
                    for (let i = 0; i < results.length; i++) {
                        poisReaviews.push(results[i].data[0]);
                    }
                    return poisReaviews;
                }, function (response) {
                    //Second function handles error
                    self.getPointsLastReviews.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getAllPoints = function () {
            self.points = [];
            self.pointsLastReviews = [];

            $http.get(serverUrl + "pointsOfInterests/")
                .then(function (response) {
                        self.points = response.data;
                        //First function handles success
                        // /*return self.getPointsLastReviews(response.data, self.points)
                        //     .then(function (poisReaviews) {
                        //         self.points = response.data;
                        //         self.pointsLastReviews = poisReaviews;*/
                        /*for (let i = 0; i < poisReaviews.length; i++) {
                            if (poisReaviews[i] === undefined) {
                                continue;
                            }
                            if (self.points[self.points.findIndex((p) => p.pointId === poisReaviews[i].pointId)].lastReviews === undefined) {
                                self.points[self.points.findIndex((p) => p.pointId === poisReaviews[i].pointId)].lastReviews = [];
                            }
                            self.points[self.points.findIndex((p) => p.pointId === poisReaviews[i].pointId)].lastReviews.push({
                                    'reviewMsg': poisReaviews[i].reviewMsg,
                                    'reviewDate': poisReaviews[i].reviewDate
                                }
                            );
                        }*/
                        // self.points = angular.merge(poisReaviews, response.data);
                        // self.favoritesPoints = favPoints;
                        self.getAllPoints.content = response.data;


                        console.log("getting all points" + self.points);
                        // })
                    }, function (response) {
                        self.getAllPoints.content = response.data;
                        //Second function handles error
                        // self.reg.content = "Something went wrong";
                        console.log("getting all points faild");
                        self.message = "Something went wrong with getting all points of interests"
                    }
                );

        }
        ;

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

        /*  self.updatePointSelected = function () {
              return self.selected;
          };*/

    }])
;

    