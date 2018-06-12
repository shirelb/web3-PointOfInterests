angular.module('pointsOfInterestApp')
// .controller('homeController', ['$scope', function ($scope) {
    .controller('homeController', ['$scope', '$location', '$http', '$q', 'setHeadersToken', 'localStorageModel', 'loggedInUsername', 'loggedInUserID', function ($scope, $location, $http, $q, setHeadersToken, localStorageModel, loggedInUsername, loggedInUserID) {
        let self = this;

        self.username = "Guest";
        self.isLoggedIn = false;

        // self.isLoggedIn = function () {
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
        // };

        self.toRestorePasswordPage = function () {
            $location.path('/restorePassword')
        };

        self.toRegisterPage = function () {
            $location.path('/register')
        };

        var serverUrl = "http://localhost:8080/";

        self.login = function () {
            console.log('User clicked submit with ', self.user);
            //$http.post(serverUrl + "users/login/authenticate", {"username": "admiin", "password": "admin2018"})//was self.user
            // $http.post(serverUrl + "users/login/authenticate", {"username": self.user.username, "password": self.user.password})//was self.user
            $http.post(serverUrl + "users/login/authenticate", self.user)//was self.user
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === "false") {
                        console.log("no such user: " + response.data.message);
                        self.message = response.data.message;
                    }
                    else {
                        console.log("user: " + response.data.message);
                        self.login.content = response.data.token;
                        self.message = response.data.message;
                        setHeadersToken.set(self.login.content);
                        loggedInUsername.set(self.user.username);
                        self.username = loggedInUsername.username;
                        self.addTokenToLocalStorage();

                        self.isLoggedIn = true;
                        self.getUserID().then(function (result) {
                            self.get2LastFavoritesPoints();
                            self.getRecommendedPoints();
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

        // self.popularPoints = {};


        self.getPopularPoints = function () {
            console.log('User clicked submit with ', self.user);
            // var serverUrl = "http://localhost:8080/";
            $http.get(serverUrl + "pointsOfInterests/populars")//was self.user
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
                    // self.message = "Something went wrong"
                });
        };

        self.getPopularPoints();

        userID = null;
        self.getUserID = function () {
            return loggedInUserID.get(self.username)
                .then(function (result) {
                    if (result.userId !== null) {
                        self.message = "";
                        userID = result.userId;
                    }
                    else {
                        self.message = result.message;
                    }

                });
        };


        self.showMsgOfFavorites = false;
        self.get2LastFavoritesPoints = function () {
            $http.get(serverUrl + "users/favoritesPoints/2Latest/userId/" + userID)//was self.user
                .then(function (response) {
                    //First function handles success
                    if (response.data.length === 0) {
                        self.showMsgOfFavorites = true;
                        self.favoritesMsg = "You haven't saved any points yet";
                    }
                    else {
                        self.showMsgOfFavorites = false;
                        self.lastFavoritesPoints = response.data;
                        console.log("getting 2 last favorites points" + self.lastFavoritesPoints);
                    }
                }, function (response) {
                    //Second function handles error
                    self.get2LastFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getRecommendedPoints = function () {
            self.recommendedPoints = [];

            $http.get(serverUrl + "users/categories/" + userID)//was self.user
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

        setFavoritesBtnAnimation = function (timeline,el) {
            var scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
            // var el = angular.element(fav_btn);
            // mo.js timeline obj
            // timeline = new mojs.Timeline();

            // tweens for the animation:

            // burst animation
            tween1 = new mojs.Burst({
                parent: el,
                radius: {0: 30},
                angle: {0: 45},
                y: 50,
                count: 10,
                radius: 30,
                children: {
                    shape: 'circle',
                    radius: 10,
                    fill: ['red', 'white'],
                    strokeWidth: 15,
                    duration: 500,
                }
            });


            tween2 = new mojs.Tween({
                duration: 900,
                onUpdate: function (progress) {
                    var scaleProgress = scaleCurve(progress);
                    el.style.WebkitTransform = el.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
                }
            });

            tween3 = new mojs.Burst({
                parent: el,
                radius: {0: 30},
                angle: {0: -45},
                y: 50,
                count: 10,
                radius: 50,
                children: {
                    shape: 'circle',
                    radius: 10,
                    fill: ['white', 'red'],
                    strokeWidth: 15,
                    duration: 400,
                }
            });

            // add tweens to timeline:
            timeline.add(tween1, tween2, tween3);
        };

        self.toggleToFavorites = function (event, point) {
            if (angular.element(event.currentTarget).hasClass("active")) {
                angular.element(event.currentTarget).removeClass("active");
            } else {
                var timeline = new mojs.Timeline();
                setFavoritesBtnAnimation(timeline,angular.element(event.currentTarget)[0]);
                timeline.play();
                angular.element(event.currentTarget).addClass("active");
            }
        };


    }]);