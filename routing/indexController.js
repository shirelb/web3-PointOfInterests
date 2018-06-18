angular.module('pointsOfInterestApp')
// .controller('indexController', ['$location', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $http, setHeadersToken, localStorageModel) {
    .controller('indexController', ['$scope', 'loggedInUsername', 'favoritesPointsService', function ($scope, loggedInUsername, favoritesPointsService) {
        self = this;

        self.isLoggedIn = function () {
            return loggedInUsername.username !== "Guest";
        };

        self.getUsername = function () {
            return loggedInUsername.username;
        };

        self.getNumberOfFavorites = function () {
            if (favoritesPointsService.favoritesPoints === undefined)
                return 0;
            else
                return favoritesPointsService.favoritesPoints.length;
        }

    }]);
