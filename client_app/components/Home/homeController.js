angular.module('pointsOfInterestApp')
    .controller('homeController', ['$scope', '$window', '$location', '$http', '$q', 'setHeadersToken', 'localStorageModel', 'loggedInUsername', 'loggedInUserID', 'favoritesPointsService', 'reviewPointsService', function ($scope, $window, $location, $http, $q, setHeadersToken, localStorageModel, loggedInUsername, loggedInUserID, favoritesPointsService, reviewPointsService) {
        let self = this;

        userID = null;
        self.getUserID = function () {
            return loggedInUserID.get(self.username)
                .then(function (result) {
                    if (result.userId !== null) {
                        self.message = "";
                        userID = result.userId;
                        favoritesPointsService.setUserID(userID);
                        favoritesPointsService.getAllFavoritesPoints();
                        reviewPointsService.setUserID(userID);
                    }
                    else {
                        self.message = result.message;
                    }

                });
        };


        self.username = loggedInUsername.username;
        self.isLoggedIn = false;
        self.message = "";

        if (loggedInUsername.username !== "Guest") {
            self.isLoggedIn = true;
            self.getUserID().then(function (result) {
                self.get2LastFavoritesPoints();
                self.getRecommendedPoints();
            });
        }
        else {
            self.isLoggedIn = false;
        }

        self.toRestorePasswordPage = function () {
            $location.path('/restorePassword')
        };

        self.toRegisterPage = function () {
            $location.path('/register')
        };

        var serverUrl = "http://localhost:8080/";

        self.login = function () {
            console.log('User clicked submit with ', self.user);
            $http.post(serverUrl + "users/login/authenticate", self.user)
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === "false") {
                        console.log("no such user: " + response.data.message);
                        self.message = response.data.message;
                    }
                    else {
                        console.log("user: " + response.data.message);

                        localStorageModel.updateLocalStorage('favoritesPointsLS', []); //clear LS from other users
                        favoritesPointsService.initFavoritesArrays();

                        self.login.content = response.data.token;
                        self.message = response.data.message;
                        setHeadersToken.set(response.data.token);
                        localStorageModel.addLocalStorage('token', response.data.token);
                        loggedInUsername.set(self.user.username);
                        self.username = loggedInUsername.username;

                        self.isLoggedIn = true;
                        self.getUserID().then(function (result) {
                            favoritesPointsService.getAllFavoritesPoints()
                                .then(function (result) {
                                    self.get2LastFavoritesPoints();
                                    self.getRecommendedPoints();
                                });
                        });
                    }

                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });

        };

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        };

        self.getPopularPoints = function () {
            console.log('User clicked submit with ', self.user);
            $http.get(serverUrl + "pointsOfInterests/populars")
                .then(function (response) {
                    //First function handles success
                    self.popularPoints = response.data;
                    //sort randomly
                    self.popularPoints = self.popularPoints.sort(function (a, b) {
                        return 0.5 - Math.random()
                    });
                    //select the first 3
                    self.popularPoints = self.popularPoints.slice(0, 3);

                    console.log("getting 3 popular points" + self.popularPoints);
                }, function (response) {
                    //Second function handles error
                    self.getPopularPoints.content = "Something went wrong";
                });
        };

        self.getPopularPoints();

        self.showMsgOfFavorites = false;
        self.get2LastFavoritesPoints = function () {
            self.lastFavoritesPoints = favoritesPointsService.get2LastFavoritesPoints();
            if (self.lastFavoritesPoints.length === 0) {
                self.showMsgOfFavorites = true;
                self.favoritesMsg = "You haven't saved any points yet";
            }
            else{
                self.showMsgOfFavorites = false;
            }
        };

        self.isFavoritePoint = function (point) {
            let res = favoritesPointsService.favoritesPoints.filter(p => (p.pointId === point.pointId));
            return res.length !== 0;
        };

        self.getRecommendedPoints = function () {
            self.recommendedPoints = [];

            $http.get(serverUrl + "users/categories/" + userID)
                .then(function (response) {
                    //First function handles success
                    self.userCategories = response.data;
                    //sort randomly
                    self.userCategories = self.userCategories.sort(function (a, b) {
                        return 0.5 - Math.random()
                    });
                    //select the first 3
                    self.userCategories = self.userCategories.slice(0, 2);
                }, function (response) {
                    //Second function handles error
                    self.getRecommendedPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                })
                .then(function (response) {
                    let arr = [];

                    for (let i = 0; i < self.userCategories.length; i++) {
                        arr.push($http.get(serverUrl + "pointsOfInterests/popularsInCategory/" + self.userCategories[i].category));
                    }

                    $q.all(arr)
                        .then(function (results) {
                            for (let i = 0; i < results.length; i++) {
                                //sort randomly
                                results[i].data = results[i].data.sort(function (a, b) {
                                    return 0.5 - Math.random()
                                });

                                self.recommendedPoints.push(results[i].data[0]);
                            }
                            //sort randomly
                            self.recommendedPoints = self.recommendedPoints.sort(function (a, b) {
                                return 0.5 - Math.random()
                            });
                            //select the first 3
                            self.recommendedPoints = self.recommendedPoints.slice(0, 2);
                        });
                }, function (response) {
                    //Second function handles error
                    self.getRecommendedPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.toggleToFavorites = function (event, point) {
            if (angular.element(event.currentTarget).hasClass("active")) {
                angular.element(event.currentTarget).removeClass("active");
                favoritesPointsService.removePointFromFavorites(point)
                    .then(function (result) {
                        self.get2LastFavoritesPoints(); //update from favs DB
                    });
                self.get2LastFavoritesPoints(); //update from favs LS
            } else {
                angular.element(event.currentTarget).addClass("active");
                favoritesPointsService.addPointToFavoritesToLS(point);
                self.get2LastFavoritesPoints();
            }
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
            if (point !== undefined) {
                self.selected = point;
                let pointWindow = $window.open("client_app/components/PointPage/pointPage.html", '_blank');
                self.selected.lastReviews = [];
                pointWindow.pointSelected = self.selected;

                pointWindow.favService = favoritesPointsService;
                pointWindow.reviewService = reviewPointsService;
                pointWindow.isLoggedIn = self.isLoggedIn;
                pointWindow.parentWindowName="home";

                self.addViewToPoint(point)
                    .then(function (result) {
                        if (result.views !== undefined) {
                            self.selected.views = result.views;
                        }
                    });

                reviewPointsService.getPointLastReviews(point)
                    .then(function (resultLastRevs) {
                        pointWindow.lastReviews = [];
                        pointWindow.lastReviews = resultLastRevs;
                    })
            }

        };

        self.isPointInDB=function(point) {
            return favoritesPointsService.favoritesPointsDB.find(x => x.pointId === point.pointId);
        };

    }]);