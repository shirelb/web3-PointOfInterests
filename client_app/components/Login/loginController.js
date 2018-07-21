angular.module('pointsOfInterestApp')
    .controller('loginController', ['$scope', '$http', '$location', 'setHeadersToken', 'localStorageModel','loggedInUsername','favoritesPointsService', function ($scope, $http, $location, setHeadersToken, localStorageModel,loggedInUsername,favoritesPointsService) {

        var self = this;

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };


        self.login = function () {
            console.log('User clicked submit with ', self.user);
            var serverUrl = "http://localhost:8080/";
            $http.post(serverUrl + "users/login/authenticate", self.user)
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === "false") {
                        console.log("no such user: " + response.data.message);
                        self.message = response.data.message;
                        $location.path('/login');
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
                        $location.path('/');
                    }

                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        };

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content);
        }

    }]);