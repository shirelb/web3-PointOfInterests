angular.module('pointsOfInterestApp')
    .controller('favoritesPointsOfInterestController', ['$scope', '$window', '$http', 'loggedInUserID', 'loggedInUsername', 'favoritesPointsService', 'ngDialog', '$rootScope', 'reviewPointsService', function ($scope, $window, $http, loggedInUserID, loggedInUsername, favoritesPointsService, ngDialog, $rootScope, reviewPointsService) {
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
                        self.updateFavoritesPoints();
                    });
            } else {
                angular.element(event.currentTarget).addClass("active");
                favoritesPointsService.addPointToFavoritesToLS(point);
            }
        };

        self.saveFavoritesInDB = function () {
            favoritesPointsService.addPointToFavoritesToDB()
                .then(function (result) {
                    self.updateFavoritesPoints();
                    self.sortByOrderNum();
                });
        };

        self.swapOrderNum = function (point1, point2) {
            favoritesPointsService.updateFavoritesOrder(point1, point2)
                .then(function (result) {
                    self.updateFavoritesPoints(); //update for points after change in DB
                });
            self.updateFavoritesPoints(); //update for points after change in LS
        };

        self.sortByOrderNum = function () {
            favoritesPointsService.sortByOrderNum();
            self.updateFavoritesPoints();
        };

        self.sortByCategory = function () {
            favoritesPointsService.sortByCategory();
            self.updateFavoritesPoints();
        };

        self.sortByRating = function () {
            favoritesPointsService.sortByRating();
            self.updateFavoritesPoints();
        };

        self.sendReviewRate = function (point, rateToAdd, hasReviewRate) {
            if (rateToAdd !== undefined) {
                console.log("sendReviewRate   ", point, "    ", rateToAdd);
                if (hasReviewRate) {
                    reviewPointsService.updateReviewRate(point, rateToAdd);
                }
                else {
                    reviewPointsService.addReviewRate(point, rateToAdd);
                }
            }
        };

        self.reviewModal = null;

        self.openReviewModal = function (point) {
            console.log("in modal  ", point);
            self.reviewModal = ngDialog.open({
                template: 'ReviewModalTemplate',
                controller: ['$scope', '$http', function ($scope, $http) {
                    const modalSelf = this;
                    modalSelf.point = point;

                    reviewPointsService.getReviewByUserIdAndPointId(point)
                        .then(function (result) {
                            if (result === undefined) {
                                modalSelf.hasReviewRate = false;
                                modalSelf.hasReviewMsg = false;
                            }
                            else {
                                if (result.rate !== null && result.rate !== undefined) {
                                    modalSelf.hasReviewRate = true;
                                    modalSelf.reviewRate = result.rate;
                                }
                                else {
                                    modalSelf.hasReviewRate = false;
                                }
                                if (result.reviewMsg !== null && result.reviewMsg !== undefined) {
                                    modalSelf.hasReviewMsg = true;
                                    modalSelf.reviewMsg = result.reviewMsg;
                                }
                                else {
                                    modalSelf.hasReviewMsg = false;
                                }
                            }
                        });

                    modalSelf.changeRateSelected = function () {
                        $scope.$parent.f_poiCtrl.pointRateToAdd = modalSelf.reviewRate;
                        $scope.$parent.f_poiCtrl.hasReviewRate = modalSelf.hasReviewRate;
                        console.log("changeRateSelected   ", modalSelf.point, "    ", modalSelf.reviewRate);
                    };

                    modalSelf.sendReviewMsg = function () {
                        console.log("sendReviewMsg   ", modalSelf.point, "    ", modalSelf.reviewMsg);
                        if (modalSelf.reviewMsg !== "" && modalSelf.reviewMsg !== undefined) {
                            if (modalSelf.hasReviewMsg) {
                                reviewPointsService.updateReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                    .then(function (comment) {
                                        modalSelf.sendReviewMsgComment = comment;
                                    });
                            }
                            else {
                                reviewPointsService.addReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                    .then(function (comment) {
                                        modalSelf.sendReviewMsgComment = comment;
                                    });
                            }
                        }
                    };
                }],
                controllerAs: 'reviewCtrl',
                scope: $scope,
                preCloseCallback: function (value) {
                    self.sendReviewRate(point, self.pointRateToAdd, self.hasReviewRate);
                    console.log('preclose', value, point, self.pointRateToAdd);
                },
            })
        };


        self.addViewToPoint = function (point) {
            return $http.put(serverUrl + "pointsOfInterests/addView", {'pointId': point.pointId})
                .then(function (response) {
                    return {views: point.views + 1};
                }, function (response) {
                    //Second function handles error
                    console.log("Something went wrong with add View To Point ");
                });
        };

        self.OpenPointPage = function (point) {
            if (point !== undefined) {
                self.selected = point;
                let pointWindow = $window.open("client_app/components/PointPage/pointPage.html", '_blank');
                self.selected.lastReviews = [];
                pointWindow.pointSelected = self.selected;

                pointWindow.favService = favoritesPointsService;
                pointWindow.reviewService = reviewPointsService;
                pointWindow.isLoggedIn = true;
                pointWindow.parentWindowName="favoritesPointsOfInterest";

                self.addViewToPoint(point)
                    .then(function (result) {
                        if (result.views !== undefined) {
                            self.selected.views = result.views;
                        }
                    });

                reviewPointsService.getPointLastReviews(point)
                    .then(function (resultLastRevs) {
                        pointWindow.lastReviews = [];
                        pointWindow.lastReviews = resultLastRevs;
                    })
            }

        };

        self.getAllCategories = function () {

            $http.get(serverUrl + "categories/")
                .then(function (response) {
                    //First function handles success
                    self.getAllCategories = response.data;
                    self.categories = response.data;

                    console.log("getting all categories" + self.categories);

                }, function (response) {
                    self.getAllCategories.content = response.data;
                    console.log("getting all categories failed");
                    self.message = "Something went wrong with getting all categories of interests"
                });

        };

        self.getAllCategories();

        self.isPointInDB = function (point) {
            return favoritesPointsService.favoritesPointsDB.find(x => x.pointId === point.pointId);
        };

    }]);