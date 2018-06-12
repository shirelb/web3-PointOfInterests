angular.module('pointsOfInterestApp')
    .controller('favoritesPointsOfInterestController', ['$scope', '$http', 'loggedInUserID', 'loggedInUsername', 'favoritesPointsService', function ($scope, $http, loggedInUserID, loggedInUsername, favoritesPointsService) {
        let self = this;

        var serverUrl = "http://localhost:8080/";

        self.updateFavoritesPoints = function () {
            self.favoritesPoints = favoritesPointsService.favoritesPoints;
            self.showMsgOfFavorites = false;
            if (self.favoritesPoints.length === 0) {
                self.showMsgOfFavorites = true;
                self.favoritesMsg = "You haven't saved any points yet";
            }
        };

        favoritesPointsService.getAllFavoritesPoints()
            .then(function (result) {
                self.updateFavoritesPoints();
            });

        self.toggleToFavorites = function (event, point) {
            if (angular.element(event.currentTarget).hasClass("active")) {
                angular.element(event.currentTarget).removeClass("active");
                favoritesPointsService.removePointFromFavorites(point)
                    .then(function (result) {
                        // self.favoritesPoints = favoritesPointsService.favoritesPoints;
                        self.updateFavoritesPoints();
                    });
            } else {
                var timeline = new mojs.Timeline();
                favoritesPointsService.setFavoritesBtnAnimation(timeline, angular.element(event.currentTarget)[0]);
                timeline.play();
                angular.element(event.currentTarget).addClass("active");
                favoritesPointsService.addPointToFavorites(point)
                    .then(function (result) {
                        // self.favoritesPoints = favoritesPointsService.favoritesPoints;
                        self.updateFavoritesPoints();
                    });
            }
        };

        /*userID = null;
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
            self.favoritesPoints=favoritesPointsService.getAllFavoritesPoints();
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
        });*/

    }]);