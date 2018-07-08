
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
        //$scope.lastReviews = $window.get2LatestReviews(self.pointSelected);
        
        /*.then(function($$state){
            if($scope.lastReviews.$$state.value.length>0){
                $scope.rev1 = $scope.lastReviews.$$state.value[0];
            }
        });*/
        self.favService = $window.favService;
        self.revService = $window.reviewService;
        self.revService.get2LatestReviews(self.pointSelected)
                                    .then(function(res){
                                        self.pointSelected.lastReviews = res;
                                        $scope.rev1 = res[0].reviewMsg;
                                    });
/*
            self.pointSelected.lastReviews = $window.get2LatestReviews(self.pointSelected);
console.log("hiiiiiiiiiiiii:\nself.pointSelected.lastReviews:"+self.pointSelected.lastReviews.$$state[0]+"\nself.lastReviews="+self.lastReviews);
        if(self.pointSelected.lastReviews.length >0){
            $scope.rev1 = self.pointSelected.lastReviews[0].reviewMsg;
            console.log(">>0:"+ self.pointSelected.lastReviews[0].reviewMsg);
        }
        if(self.pointSelected.lastReviews.length >1){
            $scope.rev2 = self.pointSelected.lastReviews[1].reviewMsg;
        }*/
        console.log("after>>1:"+ self.pointSelected.lastReviews.length);
        //self.get2LatestReviews = $window.get2LatestReviews;
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
        //self.pointSelected.lastReviews = $window.get2LatestReviews(self.pointSelected);

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
                                    //$scope.lastReviews = self.revService.get2LatestReviews(self.pointSelected);
                                    self.newRev = modalSelf.reviewMsg;
                                    //self.pointSelected.lastReviews = $window.get2LatestReviews(self.pointSelected);
                                    //self.pointSelected.lastReviews = self.revService.get2LatestReviews(self.pointSelected);
                                    self.revService.get2LatestReviews(self.pointSelected)
                                    .then(function(res){
                                        self.pointSelected.lastReviews = res;
                                        $scope.rev1 = res[0].reviewMsg;
                                    });
                                })
                                .then(function (){
                                    //self.updateRevs(self.pointSelected.lastReviews);   

                                })
                                ;
                        }
                        else {
                            self.revService.addReviewMsg(modalSelf.point, modalSelf.reviewMsg)
                                .then(function (comment) {
                                    modalSelf.sendReviewMsgComment = comment;
                                    self.newRev = modalSelf.reviewMsg;
                                    console.log("B");
                                    self.revService.get2LatestReviews(self.pointSelected)
                                    .then(function(res){
                                        self.pointSelected.lastReviews = res;
                                        $scope.rev1 = res[0].reviewMsg;
                                    });
                                }).then(function(){
                                    
                                    //self.updateRevs(self.pointSelected.lastReviews);   
                                });
                        }
                    }
                };
            }],
            controllerAs: 'reviewCtrl',
            scope: $scope,
            preCloseCallback: function (value) {
                self.sendReviewRate(point, self.pointRateToAdd, self.hasReviewRate);
                
                //$scope.lastReviews = $window.get2LatestReviews(self.pointSelected);
                //self.updateRevs(self.pointSelected.lastReviews); 
                //console.log("lastReviews: "+ $scope.lastReviews);
                //$scope.rev1 = $window.get2LatestReviews(self.pointSelected)[0];///its undefineddddd
                //$scope.rev2 = $scope.lastReviews[1];
                //console.log('preclose', value, point, self.pointRateToAdd);
                
            },
        })
    };

    
    
    self.updateRevs = function(revs){
        //$scope.lastReviews = self.revService.get2LatestReviews(self.pointSelected);

        if(revs.length>0 ){
            //$scope.rev1 = revs[0].reviewMsg;
            if(revs[0].userId===self.revService.userID){
                $scope.rev1 = self.newRev;
                self.pointSelected.lastReviews[0].reviewMsg = self.newRev;
                if(revs.length>1){

                    $scope.rev2 = revs[1].reviewMsg;
                    self.pointSelected.lastReviews[1] = revs[1];
                }
            }else{
                $scope.rev1 = self.newRev;
                self.pointSelected.lastReviews[0].reviewMsg = self.newRev;
                self.pointSelected.lastReviews[0].userId= self.revService.userID;
                $scope.rev2 = revs[0].reviewMsg;
                //self.lastReviews[1] = revs[0];
            }
            
        }else{
                $scope.rev1 = self.newRev;
                var n_rev = {'userId':self.revService.userID, 'pointId':self.pointSelected.pointId, 'reviewMsg':self.newRev, 'reviewDate': new Date()};
                self.pointSelected.lastReviews[0] =n_rev;//{'userId':self.revService.userID, 'pointId':self.pointSelected.pointId, 'reviewMsg':self.newRev, 'reviewDate': new Date()};// {userId:self.revService.userID, pointId:self.pointSelected.pointId, reviewMsg:self.newRev, reviewDate:""};
                console.log("pointSelected.lastRev.len after adding new rev: "+ self.pointSelected.lastReviews.length);
                //self.pointSelected.lastReviews[0].reviewMsg = self.newRev;
                //self.pointSelected.lastReviews[0].userId= self.revService.userID;
        }
        
        console.log("rev!1: "+ revs+" \n")
    };
    window.onload = function() {
        self.revService.get2LatestReviews(self.pointSelected)
                                    .then(function(res){
                                        self.pointSelected.lastReviews = res;
                                        $scope.rev1 = res[0].reviewMsg;
                                    });
      };
    

/////////////////////////
    }]);

