angular.module('pointsOfInterestApp')
    .controller('indexController', ['$scope', '$location', '$route', 'loggedInUsername', 'loggedInUserID', 'favoritesPointsService', 'ngDialog', 'localStorageModel', '$http', 'setHeadersToken', 'reviewPointsService', function ($scope, $location, $route, loggedInUsername, loggedInUserID, favoritesPointsService, ngDialog, localStorageModel, $http, setHeadersToken, reviewPointsService) {
        self = this;

        var serverUrl = "http://localhost:8080/";

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
        };

        self.logoutUser = function () {
            localStorageModel.updateLocalStorage('favoritesPointsLS', []); //clear LS from other users
            favoritesPointsService.initFavoritesArrays();
            loggedInUsername.set("Guest");

            localStorageModel.deleteLocalStorage('token');

            $location.path('/');
            $route.reload();

            ngDialog.closeAll();
        };

        self.logout = function () {
            if (favoritesPointsService.favoritesPointsLS.length > 0) {
                var logoutModal = ngDialog.open({
                    scope: $scope,
                    className: 'ngdialog-theme-default',
                    template:
                    '<div class="ngdialog-message">' +
                    '  <h2 class="confirmation-title">Are you sure?</h2>' +
                    '  <h3 class="confirmation-title">You have some unsaved points</h3>' +
                    '  <h4 class="confirmation-title">Unsaved points will be deleted when you logout</h4>' +
                    '    <div class="ngdialog-buttons">' +
                    '      <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="logoutCtrl.saveAndLogout() && ngDialog.closeThisDialog()">Save</button>' +
                    '      <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="logoutCtrl.logout() && ngDialog.closeThisDialog()">Logout</button>' +
                    '    </div>' +
                    '</div>',
                    plain: true,
                    controller: ['favoritesPointsService', function (favoritesPointsService) {
                        self = this;
                        self.saveAndLogout = function () {
                            favoritesPointsService.addPointToFavoritesToDB()
                                .then(function (result) {
                                    $scope.indexCtrl.logoutUser();
                                });
                        };
                        self.logout = function () {
                            $scope.indexCtrl.logoutUser();
                        };
                    }],
                    controllerAs: 'logoutCtrl',
                    closeByNavigation: true
                });
            }
            else {
                $scope.indexCtrl.logoutUser();
            }
        };

        self.checkIfExistTokenIsValid = function () {
            if (localStorageModel.getLocalStorage('token')) {
                $http.defaults.headers.common['x-access-token'] = localStorageModel.getLocalStorage('token');
                $http.post(serverUrl + "users/validToken/")
                    .then(function (response) {
                        if (response.data.success === "valid token!") {
                            setHeadersToken.set(localStorageModel.getLocalStorage('token'));
                            loggedInUsername.set(response.data.payload.username);

                            loggedInUserID.get(loggedInUsername.username)
                                .then(function (result) {
                                    if (result.userId !== null) {
                                        self.message = "";
                                        userID = result.userId;
                                        favoritesPointsService.setUserID(userID);
                                        favoritesPointsService.getAllFavoritesPoints()
                                            .then(function (result) {
                                                self.getNumberOfFavorites();
                                                $route.reload();
                                            });
                                        reviewPointsService.setUserID(userID);
                                    }
                                    else {
                                        self.message = result.message;
                                    }

                                });
                        }
                        else {
                            localStorageModel.updateLocalStorage('favoritesPointsLS', []); //clear LS from other users
                            favoritesPointsService.initFavoritesArrays();
                            loggedInUsername.set("Guest");

                            localStorageModel.deleteLocalStorage('token');
                        }
                    }, function (response) {
                        //Second function handles error
                        console.log("Something went wrong with add View To Point ");
                    });
            }
        };

        self.checkIfExistTokenIsValid();

    }]);
