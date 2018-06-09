angular.module('pointsOfInterestApp')
    .controller('loginController', ['$scope', '$http', '$location', 'setHeadersToken', 'localStorageModel','loggedInUsername', function ($scope, $http, $location, setHeadersToken, localStorageModel,loggedInUsername) {

        var self = this;

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };


        self.login = function () {
            console.log('User clicked submit with ', self.user);
            var serverUrl = "http://localhost:8080/";
            //$http.post(serverUrl + "users/login/authenticate", {"username": "admiin", "password": "admin2018"})//was self.user
            // $http.post(serverUrl + "users/login/authenticate", {"username": self.user.username, "password": self.user.password})//was self.user
            $http.post(serverUrl + "users/login/authenticate", self.user)//was self.user
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === "false") {
                        console.log("no such user: " + response.data.message);
                        self.message = response.data.message;
                        $location.path('/login');
                    }
                    else {
                        console.log("user: " + response.data.message);
                        self.login.content = response.data.token;
                        self.message = response.data.message;
                        setHeadersToken.set(self.login.content);
                        loggedInUsername.set(self.user.username);
                        self.addTokenToLocalStorage();
                        $location.path('/');
                    }

                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        };

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }

    }]);