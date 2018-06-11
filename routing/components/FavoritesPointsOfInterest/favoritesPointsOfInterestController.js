angular.module('pointsOfInterestApp')
    .controller('favoritesPointsOfInterestController', ['$scope', '$http', 'loggedInUserID','loggedInUsername', function ($scope, $http, loggedInUserID,loggedInUsername) {
        let self = this;

        var serverUrl = "http://localhost:8080/";

        self.favoritesPoints = {};

        userID = null;
        self.getUserID = function () {
            return loggedInUserID.get(loggedInUsername.username)
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

        self.getFavoritesPoints = function () {
            $http.get(serverUrl + "users/favoritesPoints/userId/" + userID)//was self.user
                .then(function (response) {
                    //First function handles success
                    if (response.data.length === 0) {
                        self.showMsgOfFavorites = true;
                        self.favoritesMsg = "You haven't saved any points yet";
                    }
                    else {
                        self.showMsgOfFavorites = false;
                        self.favoritesPoints = response.data;
                        console.log("getting 2 last favorites points" + self.favoritesPoints);
                    }
                }, function (response) {
                    //Second function handles error
                    self.getFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getUserID().then(function (result) {
            self.getFavoritesPoints();
        });

    }]);