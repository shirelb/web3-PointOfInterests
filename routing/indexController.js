angular.module('pointsOfInterestApp')
// .controller('indexController', ['$location', '$http', 'setHeadersToken', 'localStorageModel', function ($location, $http, setHeadersToken, localStorageModel) {
    .controller('indexController', ['$scope', '$location', '$route', 'loggedInUsername', 'favoritesPointsService', 'ngDialog', 'localStorageModel', function ($scope, $location, $route, loggedInUsername, favoritesPointsService, ngDialog, localStorageModel) {
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
        };

        self.logoutUser = function () {
            localStorageModel.updateLocalStorage('favoritesPointsLS', []); //clear LS from other users
            favoritesPointsService.initFavoritesArrays();
            loggedInUsername.set("Guest");
            $location.path('/');
            $route.reload();

            // logoutModal.close();
            ngDialog.closeAll();
        };

        // self.logoutModal = null;

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
                                    // $scope.indexCtrl.logoutModal.close();
                                    // this.closeThisDialog();
                                });
                        };
                        self.logout = function () {
                            $scope.indexCtrl.logoutUser();
                            this.closeThisDialog();
                            // $scope.indexCtrl.logoutModal.close();
                        };
                    }],
                    controllerAs: 'logoutCtrl',
                    closeByNavigation: true
                });
                /*.then(function (save) {
                alert('Confirmed');
                favoritesPointsService.addPointToFavoritesToDB()
                    .then(function (result) {
                        $scope.indexCtrl.logoutUser();
                    });
            }, function (logout) {
                alert('Rejected');
                $scope.indexCtrl.logoutUser();
            });*/
            }
            else {
                $scope.indexCtrl.logoutUser();
            }
        };


    }]);
