angular.module('pointsOfInterestApp')
// .controller('homeController', ['$scope', function ($scope) {
    .controller('homeController', ['$scope', '$location', '$http', 'setHeadersToken', 'localStorageModel', 'loggedInUsername', 'loggedInUserID', function ($scope, $location, $http, setHeadersToken, localStorageModel, loggedInUsername, loggedInUserID) {
        let self = this;

        self.username="Guest";
        self.isLoggedIn = false;

        // self.isLoggedIn = function () {
            if( loggedInUsername.username !== "Guest"){
                self.getUserID();
                self.get2LastFavoritesPoints();
                self.isLoggedIn = true;
            }
            else{
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
                        self.getUserID();
                        self.get2LastFavoritesPoints();
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
                    self.getAllPoints.content = response.data;
                    //Second function handles error
                    self.getPopularPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getPopularPoints();

        userID = null;
        self.getUserID = function () {
            loggedInUserID.get(self.username)
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
                    self.getAllPoints.content = response.data;
                    //Second function handles error
                    self.get2LastFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };



        self.directToPOI = function () {
            $location.path('/poi')
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);