angular.module('pointPageApp', ['LocalStorageModule', 'ngDialog'])
// .controller('pointPageController', ['pageForPoint', function (pageForPoint) {
    .controller('pointPageController', ['$window', '$http', '$scope', 'localStorageService', 'ngDialog', function ($window, $http, $scope, localStorageService, ngDialog) {

        var self = this;

        // let serverUrl = "http://localhost:8080/";

        self.pointSelected = $window.pointSelected;
        self.favService = $window.favService;
        self.revService = $window.reviewService;
        self.lastReviews = $window.lastReviews;
        self.isLoggedIn = $window.isLoggedIn;
        self.parentWindowName= $window.parentWindowName;

        self.updateFavoritesMainApp=function (){
            if(self.parentWindowName==="home")   {
                opener.location.reload();
            }
            if(self.parentWindowName==="favoritesPointsOfInterest")   {
                opener.location.reload();
            }
            if(self.parentWindowName==="pointsOfInterest")   {
                opener.location.reload();
            }
        };

        self.toggleToFavorites = function (event) {
            let point = self.pointSelected;
            if (angular.element(event.currentTarget).hasClass("active")) {
                angular.element(event.currentTarget).removeClass("active");
                self.favService.removePointFromFavorites(point)
                    .then(function (result) {
                        //self.get2LastFavoritesPoints();
                        self.updateFavoritesMainApp();
                        console.log("point removed from favorites");
                    });
            } else {
                //var timeline = new mojs.Timeline();
                //self.favService.setFavoritesBtnAnimation(timeline, angular.element(event.currentTarget)[0]);
                //timeline.play();
                angular.element(event.currentTarget).addClass("active");
                self.favService.addPointToFavoritesToLS(point);
                self.updateFavoritesMainApp();
            }
        };

        self.isFavoritePoint = function () {
            let point = self.pointSelected;
            let res = self.favService.favoritesPoints.filter(p => (p.pointId === point.pointId));
            return res.length !== 0;
        };

        self.sendReviewRate = function (point, rateToAdd, hasReviewRate) {
            if (rateToAdd !== undefined) {
                console.log("sendReviewRate   ", point, "    ", rateToAdd);
                if (hasReviewRate) {
                    self.revService.updateReviewRate(point, rateToAdd);
                }
                else {
                    self.revService.addReviewRate(point, rateToAdd);
                }
            }
        };

        self.updateLatestReviews = function () {
            self.revService.get2LatestReviews(self.pointSelected)
                .then(function (result) {
                    console.log("in $window.get2LatestReviews 1 ", self.lastReviews);
                    // $scope.$parent.pointCtrl.lastReviews=[];
                    // $scope.$parent.pointCtrl.lastReviews=result;
                    self.lastReviews = [];
                    self.lastReviews = result;
                    console.log("in $window.get2LatestReviews 2 ", self.lastReviews);
                });
        };

        self.reviewModal = null;

        self.openReviewModal = function () {
            console.log("in modal  ", self.pointSelected);
            self.reviewModal = ngDialog.open({
                template: 'ReviewModalTemplate',
                controller: ['$scope', '$http', '$window', function ($scope, $http, $window) {
                    var modalSelf = this;
                    modalSelf.point = $scope.$parent.pointCtrl.pointSelected;

                    $scope.$parent.pointCtrl.revService.getReviewByUserIdAndPointId($scope.$parent.pointCtrl.pointSelected)
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
                            $scope.$apply();
                        });

                    modalSelf.changeRateSelected = function () {
                        $scope.$parent.pointCtrl.pointRateToAdd = modalSelf.reviewRate;
                        $scope.$parent.pointCtrl.hasReviewRate = modalSelf.hasReviewRate;
                        console.log("changeRateSelected   ", modalSelf.point, "    ", modalSelf.reviewRate);
                    };

                    modalSelf.sendReviewMsg = function () {
                        console.log("sendReviewMsg   ", modalSelf.point, "    ", modalSelf.reviewMsg);
                        if (modalSelf.reviewMsg !== "" && modalSelf.reviewMsg !== undefined) {
                            if (modalSelf.hasReviewMsg) {
                                $scope.$parent.pointCtrl.revService.updateReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                    .then(function (comment) {
                                        modalSelf.sendReviewMsgComment = comment;
                                        $scope.$parent.pointCtrl.updateLatestReviews();
                                    });
                            }
                            else {
                                $scope.$parent.pointCtrl.revService.addReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                    .then(function (comment) {
                                        modalSelf.sendReviewMsgComment = comment;
                                        $scope.$parent.pointCtrl.updateLatestReviews();
                                    });
                            }
                        }
                    };
                }],
                controllerAs: 'poiReviewCtrl',
                scope: $scope,
                preCloseCallback: function (value) {
                    self.sendReviewRate(self.pointSelected, self.pointRateToAdd, self.hasReviewRate);
                    self.updateLatestReviews();
                    console.log('preclose', value, self.pointSelected, self.pointRateToAdd);
                },
            })
        };

        self.isPointInDB = function () {
            return self.favService.favoritesPointsDB.find(x => x.pointId === self.pointSelected.pointId);
        };

        self.showPointOnMap = function () {
            var pointMap = L.map('point_map').setView([self.pointSelected.pointXcoordinate, self.pointSelected.pointYcoordinate], 13);

            /*L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(pointMap);*/

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(pointMap);

            L.marker([self.pointSelected.pointXcoordinate, self.pointSelected.pointYcoordinate]).addTo(pointMap)
                .bindPopup("<b>" + self.pointSelected.name + "</b>").openPopup();
        };

        self.showPointOnMap();

    }]);

