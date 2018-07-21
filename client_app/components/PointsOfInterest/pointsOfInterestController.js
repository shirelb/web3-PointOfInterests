angular.module('pointsOfInterestApp')
    .controller('pointsOfInterestController', ['$scope', '$window', '$http', 'localStorageModel', '$rootScope', '$q', 'favoritesPointsService', 'reviewPointsService', 'loggedInUsername', function ($scope, $window, $http, localStorageModel, $rootScope, $q, favoritesPointsService, reviewPointsService, loggedInUsername) {
        let self = this;

        let serverUrl = "http://localhost:8080/";

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
            pointWindow.pointSelected = self.selected;

            pointWindow.favService = favoritesPointsService;
            pointWindow.reviewService = reviewPointsService;

            pointWindow.isLoggedIn = loggedInUsername.username !== "Guest";
            pointWindow.parentWindowName = "pointsOfInterest";

            self.addViewToPoint(point)
                .then(function (result) {
                    if (result.views !== undefined) {
                        self.selected.views = result.views;
                    }
                });

            reviewPointsService.get2LatestReviews(point)
                .then(function (result) {

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
                        self.getAllPoints.content = response.data;


                        console.log("getting all points" + self.points);
                    }, function (response) {
                        self.getAllPoints.content = response.data;
                        //Second function handles error
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


        self.getAllPoints();
        self.getAllCategories();

        self.sortByRating = function () {
            self.points.sort((a, b) => a.rating - b.rating);
        };

        self.sortByName = function () {
            self.points = _.orderBy(self.points, ['name'], ['asc']); // Use Lodash to sort array by 'name'
        };

        self.sortByCategory = function () {
            self.points = _.orderBy(self.points, ['category'], ['asc']); // Use Lodash to sort array by 'name'
        };

        self.toggleToFavorites = function (event, point) {
            if (angular.element(event.currentTarget).hasClass("active")) {
                angular.element(event.currentTarget).removeClass("active");
                favoritesPointsService.removePointFromFavorites(point)
                    .then(function (result) {
                    });
            } else {
                angular.element(event.currentTarget).addClass("active");
                favoritesPointsService.addPointToFavoritesToLS(point);
            }
        };

        self.isPointInDB = function (point) {
            return favoritesPointsService.favoritesPointsDB.find(x => x.pointId === point.pointId);
        };

        self.isFavoritePoint = function (point) {
            let res = favoritesPointsService.favoritesPoints.filter(p => (p.pointId === point.pointId));
            return res.length !== 0;
        };

        self.isLoggedIn = loggedInUsername.username !== "Guest";

    }]);

    