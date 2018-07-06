
angular.module('pointPageApp', ["LocalStorageModule", "ngRoute","ngDialog"])
// .controller('pointPageController', ['pageForPoint', function (pageForPoint) {
    //.controller('pointPageController', [ '$window', '$http', '$scope', 'localStorageService','ngDialog', '$rootScope', function ( $window, $http, $scope, localStorageService, ngDialog,  $rootScope) {
        .controller('pointPageController', ['$scope', '$window', '$http' , 'ngDialog', '$rootScope', function ($scope, $window, $http,  ngDialog, $rootScope) {

        let self = this;

        // let serverUrl = "http://localhost:8080/";

        // $http.defaults.headers.common['x-access-token'] = localStorageService.get('token');
        // $window.onload = function() {
        //     self.pointSelected = $window.pointData.point;
        //     self.pointReviews = $window.pointData.lastReviews;
        // };
        self.pointSelected = $window.pointSelected;
        $scope.lastReviews = $window.get2LatestReviews(self.pointSelected);
        console.log("$scope.lastReviews;;;;"+self.pointSelected.lastReviews[0].reviewMsg);
        //$scope.lastReviews = reviewPointsService.get2LatestReviews(self.pointSelected);
        if(self.pointSelected.lastReviews.length >0){
            $scope.rev1 = self.pointSelected.lastReviews[0].reviewMsg;
        }
        if(self.pointSelected.lastReviews.length >1){
            $scope.rev2 = self.pointSelected.lastReviews[1].reviewMsg;
        }
        self.favService = $window.favService;
        self.revService = $window.reviewService;
        self.get2LatestReviews = $window.get2LatestReviews;
        console.log("pointpagecontroller: self.favService >>"+self.favService);
        console.log("pointpagecontroller: self.revService >>"+self.revService);
        console.log("pointpagecontroller: $window.favService >>"+$window.favService);
        console.log("pointpagecontroller: $window.pointSelected >>"+ $window.pointSelected);

        // console.log($scope.$parent.pointSelected);
        // $scope.$on('pointSelected-update', function (event, args) {
        //     self.pointSelected = args.pointSelected;
        //     console.log($scope.pointSelected);
        //     // do what you want to do
        // });
        // self.pointReviews = $window.pointReviews;

        // self.get2LatestReviews = function () {
        //     $http.get(serverUrl + "reviews/2Latest/pointId/" + self.pointSelected.pointId)
        //     // $http.get(serverUrl + "reviews/2Latest/pointId/5")
        //         .then(function (response) {
        //             self.pointReviews = response.data;
        //         }, function (response) {
        //             //Second function handles error
        //             console.log("Something went wrong with bringing 2 latest reviews ");
        //         });
        //
        // };
        //
        // self.get2LatestReviews();

        /*let pointData = localStorageService.get('pointsSelected').sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateSelected) - new Date(a.dateSelected);
        })[0];
        self.pointSelected = pointData.point;
        self.pointReviews = pointData.pointReviews;
        */
       self.toggleToFavorites = function (event) {
           let point = self.pointSelected;
        if (angular.element(event.currentTarget).hasClass("active")) {
            angular.element(event.currentTarget).removeClass("active");
            self.favService.removePointFromFavorites(point)
                .then(function (result) {
                    //self.get2LastFavoritesPoints();
                    console.log("point removed from favorites");
                });
        } else {
            //var timeline = new mojs.Timeline();
            //self.favService.setFavoritesBtnAnimation(timeline, angular.element(event.currentTarget)[0]);
            //timeline.play();
            angular.element(event.currentTarget).addClass("active");
            self.favService.addPointToFavorites(point)
                .then(function (result) {
                    //self.get2LastFavoritesPoints();
                    console.log("point added to favorites");
                });
        }
    };

    self.isFavoritePoint = function () {
        let point = self.pointSelected;
        let res = self.favService.favoritesPoints.filter(p => (p.pointId === point.pointId));
        return res.length !== 0;
    };


    self.insertReview = function(){
        let point = self.pointSelected;
        console.log("pointpagecontroller: self.revService >>"+self.revService);

        self.revService.getReviewByUserIdAndPointId(point)
        .then(function (result){
            if(result.length===0){
                self.review =  "";
                console.log("no old review");
            }else{
                self.review =  self.revService.getReviewByUserIdAndPointId(point)[0];
                console.log(" old review found to this user for this point");
            }
        });
    
    };
    
    self.addReview = function(){
        let msg = self.review;
        let point = self.pointSelected;
        if(self.revService.getReviewByUserIdAndPointId(point).length === 0){
            self.revService.addReviewMsg(point, msg);
            console.log("review added succesfuly");
        }
        else{
            self.revService.updateReviewMsg(point, msg);
            console.log("review updated succesfuly");
        }
    };


    ///////////////////
    self.sendReviewRate = function ( rateToAdd, hasReviewRate) {
        let point = self.pointSelected;
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


    self.openReviewModal = function () {
        let point = self.pointSelected;
        console.log("in modal  ", point);
        self.reviewModal = ngDialog.open({
            template: 'ReviewModalTemplate',
            controller: ['$scope', '$http', function ($scope, $http) {
                const modalSelf = this;
                modalSelf.point = point;

                self.revService.getReviewByUserIdAndPointId(point)
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
                    self.pointRateToAdd = modalSelf.reviewRate;
                    self.hasReviewRate = modalSelf.hasReviewRate;
                    console.log("changeRateSelected   ", modalSelf.point, "    ", modalSelf.reviewRate);
                };

                //modalSelf.sendReviewMsg = function () {
                modalSelf.sendReviewMsg = function () {
                        console.log("sendReviewMsg   ", modalSelf.point, "    ", modalSelf.reviewMsg);
                    if (modalSelf.reviewMsg !== "" && modalSelf.reviewMsg !== undefined) {
                        if (modalSelf.hasReviewMsg) {
                            self.revService.updateReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                .then(function (comment) {
                                    modalSelf.sendReviewMsgComment = comment;
                                    //$scope.lastReviews = $window.get2LatestReviews(self.pointSelected);
                                    //self.pointSelected.lastReviews = $window.get2LatestReviews(self.pointSelected);
                                    self.pointSelected.lastReviews = self.revService.get2LatestReviews(self.pointSelected);
                                    self.updateRevs(self.pointSelected.lastReviews);   
                                })
                                .then(function (){

                                })
                                ;
                        }
                        else {
                            self.revService.addReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                .then(function (comment) {
                                    modalSelf.sendReviewMsgComment = comment;
                                    console.log("B");
                                    updateRevs($window.get2LatestReviews(self.pointSelected));   
                                });
                        }
                    }
                };
            }],
            controllerAs: 'reviewCtrl',
            scope: $scope,
            preCloseCallback: function (value) {
                self.sendReviewRate(point, self.pointRateToAdd, self.hasReviewRate);
                //self.pointSelected.lastReviews = self.get2LatestReviews(self.pointSelected);
                console.log("in the callback");
                //$scope.lastReviews = $window.get2LatestReviews(self.pointSelected);
                self.updateRevs(self.pointSelected.lastReviews); 
                console.log("lastReviews: "+ $scope.lastReviews);
                //$scope.rev1 = $window.get2LatestReviews(self.pointSelected)[0];///its undefineddddd
                //$scope.rev2 = $scope.lastReviews[1];
                console.log('preclose', value, point, self.pointRateToAdd);
                
            },
        })
    };

    self.updateRevs = function(revs){
        if(revs.length>0){
            $scope.rev1 = revs[0].reviewMsg;
        }
        if(revs.length>1){
            $scope.rev1 = revs[1].reviewMsg;
        }
        console.log("rev!1: "+ revs+" \n")
    };


/////////////////////////
    }]);

