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

        self.swapOrderNum = function (point1,point2) {
            favoritesPointsService.updateFavoritesOrder(point1,point2)
                .then(function (result) {
                    // self.favoritesPoints = favoritesPointsService.favoritesPoints;
                    self.updateFavoritesPoints();
                });
        };

        self.sortByOrderNum=function () {
            favoritesPointsService.sortByOrderNum();
            self.updateFavoritesPoints();
        };

        self.sortByCategory=function () {
            favoritesPointsService.sortByCategory();
            self.updateFavoritesPoints();
        };

        self.sortByRating=function () {
            favoritesPointsService.sortByRating();
            self.updateFavoritesPoints();
        };

    }]);