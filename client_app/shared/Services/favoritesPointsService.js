angular.module("pointsOfInterestApp")
    .service('favoritesPointsService', ['$http', '$q', 'localStorageModel', function ($http, $q, localStorageModel) {

        let self = this;

        self.favoritesPointsLS = [];
        self.favoritesPointsDB = [];
        self.favoritesPoints = [];

        self.userID = null;
        self.setUserID = function (userID) {
            self.userID = userID;
        };

        var serverUrl = "http://localhost:8080/";

        self.getPointsByID = function (favPointsID, favPoints) {
            favPoints = [];
            let arr = [];

            for (let i = 0; i < favPointsID.length; i++) {
                arr.push($http.get(serverUrl + "pointsOfInterests/id/" + favPointsID[i].pointId));
            }

            return $q.all(arr)
                .then(function (results) {
                    for (let i = 0; i < results.length; i++) {
                        favPoints.push(results[i].data[0]);
                    }
                    return favPoints;
                }, function (response) {
                    //Second function handles error
                    self.getPointsByID.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getAllFavoritesPointsDB = function () {
            return $http.get(serverUrl + "users/favoritesPoints/userId/" + self.userID)
                .then(function (response) {
                    //First function handles success
                    if (response.data.length !== 0) {
                        return self.getPointsByID(response.data, self.favoritesPointsDB)
                            .then(function (favPoints) {
                                self.favoritesPointsDB = angular.merge(favPoints, response.data);
                                // self.favoritesPoints = favPoints;
                                // localStorageModel.updateLocalStorage('favoritesPoints', self.favoritesPoints);
                                console.log("getting favorites points" + self.favoritesPointsDB);
                            })
                    }
                }, function (response) {
                    //Second function handles error
                    self.getAllFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.getAllFavoritesPointsLS = function () {
            self.favoritesPointsLS = localStorageModel.getLocalStorage('favoritesPointsLS');
            if (self.favoritesPointsLS === null) {
                self.favoritesPointsLS = [];
            }
            // return self.favoritesPointsLS;
        };

        self.getAllFavoritesPoints = function () {
            return self.getAllFavoritesPointsDB()
                .then(function (result) {
                    self.getAllFavoritesPointsLS();
                    self.favoritesPoints = _.unionBy(self.favoritesPointsDB, self.favoritesPoints, "pointId");
                    self.favoritesPoints = _.unionBy(self.favoritesPointsLS, self.favoritesPoints, "pointId");
                    // _.merge(self.favoritesPoints, self.favoritesPointsLS,self.favoritesPointsDB);
                    // _.merge(self.favoritesPoints, self.favoritesPointsDB);
                });
        };

        self.nextOrderNum = function () {
            if (self.favoritesPoints.length === 0)
                return 1;
            let favByOrderNum = _.sortBy(self.favoritesPoints, ['orderNum']);
            return _.last(favByOrderNum).orderNum + 1;
        };

        self.addPointToFavoritesToLS = function (point) {
            /*favPoint = {
                'userId': self.userID,
                'pointId': point.pointId,
                'orderNum': self.favoritesPointsLS.length + self.favoritesPointsDB.length,
                'savedDate': new Date()
            };*/
            point.userId = self.userID;
            // point.pointId=point.pointId;
            point.orderNum = self.nextOrderNum();
            point.savedDate = new Date();
            self.favoritesPointsLS.push(point);
            localStorageModel.updateLocalStorage('favoritesPointsLS', self.favoritesPointsLS);
            // self.favoritesPoints = angular.merge(self.favoritesPoints, self.favoritesPointsLS);
            self.favoritesPoints = _.unionBy(self.favoritesPointsLS, self.favoritesPoints, "pointId");
        };

        self.addPointToFavoritesToDB = function (point) {
            // updateFavoritesPointsDB = angular.merge(self.favoritesPointsLS, self.favoritesPointsDB);

            let arr = [];

            for (let i = 0; i < self.favoritesPointsLS.length; i++) {
                favPoint = {
                    'userId': self.favoritesPointsLS[i].userId,
                    'pointId': self.favoritesPointsLS[i].pointId,
                    'orderNum': self.favoritesPointsLS[i].orderNum,
                    'savedDate': self.favoritesPointsLS[i].savedDate,
                };
                arr.push($http.post(serverUrl + "users/favoritesPoints/add", favPoint));
            }

            return $q.all(arr)
                .then(function (results) {
                    self.favoritesPointsDB = _.unionBy(self.favoritesPointsLS, self.favoritesPointsDB, "pointId");
                    self.favoritesPointsLS = [];
                    localStorageModel.updateLocalStorage('favoritesPointsLS', self.favoritesPointsLS);
                    self.favoritesPoints = _.unionBy(self.favoritesPointsDB, self.favoritesPoints, "pointId");
                    self.favoritesPoints = _.unionBy(self.favoritesPointsLS, self.favoritesPoints, "pointId");
                    // _.merge(self.favoritesPointsDB, self.favoritesPointsLS,self.favoritesPointsDB);
                    // _.merge(self.favoritesPoints, self.favoritesPointsLS,self.favoritesPointsDB);
                    return self.favoritesPoints;
                }, function (response) {
                    //Second function handles error
                    self.addPointToFavoritesToDB.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });


            /*favPoint = {
                'userId': self.userID,
                'pointId': point.pointId,
                'orderNum': self.favoritesPointsLS.length + self.favoritesPointsDB.length,
                'savedDate': new Date()
            };
            return $http.post(serverUrl + "users/favoritesPoints/add", favPoint)
                .then(function (response) {
                    //First function handles success
                    //add point to the array
                    point.favPoint = favPoint;
                    self.favoritesPointsDB.push(point);
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.addPointToFavoritesToDB.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });*/
        };

        self.removePointFromFavorites = function (point) {
            if (self.favoritesPointsLS.find(x => x.pointId === point.pointId)) {
                self.favoritesPointsLS.splice(
                    self.favoritesPointsLS.findIndex(
                        (p) => p.pointId === point.pointId
                    ), 1
                );

                self.favoritesPoints.splice(
                    self.favoritesPoints.findIndex(
                        (p) => p.pointId === point.pointId
                    ), 1
                );
                localStorageModel.updateLocalStorage('favoritesPointsLS', self.favoritesPointsLS);
                // return new Promise(resolve => self.favoritesPoints);
                return Promise.resolve(self.favoritesPoints);
            }

            if (self.favoritesPointsDB.find(x => x.pointId === point.pointId)) {
                return $http.delete(serverUrl + "users/favoritesPoints/remove/userId/" + self.userID + "/pointId/" + point.pointId)
                    .then(function (response) {
                        //First function handles success
                        //remove the point from the array
                        self.favoritesPointsDB.splice(
                            self.favoritesPointsDB.findIndex(
                                (p) => p.pointId === point.pointId
                            ), 1
                        );
                        self.favoritesPoints.splice(
                            self.favoritesPoints.findIndex(
                                (p) => p.pointId === point.pointId
                            ), 1
                        );
                        return response.data;
                    }, function (response) {
                        //Second function handles error
                        self.removePointFromFavorites.content = "Something went wrong";
                        // self.message = "Something went wrong"
                    });
            }

        };

        self.updateFavoritesOrderPointsInLSAndDB = function (pointLS, pointDB) {

            let updatedPointDB = {
                'orderNum': pointLS.orderNum,
                'userId': pointDB.userId,
                'pointId': pointDB.pointId
            };

            return $http.put(serverUrl + "users/favoritesPoints/update/", updatedPointDB)
                .then(function (response) {
                    let orderNumTemp = pointLS.orderNum;

                    self.favoritesPointsLS[
                        self.favoritesPointsLS.findIndex((p) => p.pointId === pointLS.pointId)
                        ].orderNum = pointDB.orderNum;

                    self.favoritesPointsDB[
                        self.favoritesPointsDB.findIndex((p) => p.pointId === pointDB.pointId)
                        ].orderNum = orderNumTemp;

                    self.favoritesPoints = _.unionBy(self.favoritesPointsDB, self.favoritesPoints, "pointId");
                    self.favoritesPoints = _.unionBy(self.favoritesPointsLS, self.favoritesPoints, "pointId");
                    self.sortByOrderNum();
                    return self.favoritesPoints;
                }, function (response) {
                    //Second function handles error
                    self.updateFavoritesOrderPointsInLSAndDB.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.updateFavoritesOrder = function (pointUp, pointDown) {
            //both points in LS
            if (self.favoritesPointsLS.find(x => x.pointId === pointUp.pointId)
                && self.favoritesPointsLS.find(x => x.pointId === pointDown.pointId)) {
                let orderNumTemp = pointUp.orderNum;
                self.favoritesPointsLS[
                    self.favoritesPointsLS.findIndex((p) => p.pointId === pointUp.pointId)
                    ].orderNum = pointDown.orderNum;
                self.favoritesPointsLS[
                    self.favoritesPointsLS.findIndex((p) => p.pointId === pointDown.pointId)
                    ].orderNum = orderNumTemp;
                self.favoritesPoints = _.unionBy(self.favoritesPointsLS, self.favoritesPoints, "pointId");
                self.sortByOrderNum();
                return new Promise(resolve => self.favoritesPoints);
            }

            //both points in DB
            else if (self.favoritesPointsDB.find(x => x.pointId === pointUp.pointId)
                && self.favoritesPointsDB.find(x => x.pointId === pointDown.pointId)) {
                let arr = [];

                let updatedPointUp = {
                    'orderNum': pointDown.orderNum,
                    'userId': pointUp.userId,
                    'pointId': pointUp.pointId
                };
                let updatedPointDown = {
                    'orderNum': pointUp.orderNum,
                    'userId': pointDown.userId,
                    'pointId': pointDown.pointId
                };

                // return $http.put(serverUrl + "users/favoritesPoints/update/", updatedPointUp)

                arr.push($http.put(serverUrl + "users/favoritesPoints/update/", updatedPointUp));
                arr.push($http.put(serverUrl + "users/favoritesPoints/update/", updatedPointDown));

                return $q.all(arr)
                    .then(function (results) {
                        let orderNumTemp = pointUp.orderNum;
                        self.favoritesPointsDB[
                            self.favoritesPointsDB.findIndex((p) => p.pointId === pointUp.pointId)
                            ].orderNum = pointDown.orderNum;
                        self.favoritesPointsDB[
                            self.favoritesPointsDB.findIndex((p) => p.pointId === pointDown.pointId)
                            ].orderNum = orderNumTemp;
                        self.favoritesPoints = _.unionBy(self.favoritesPointsDB, self.favoritesPoints, "pointId");
                        self.sortByOrderNum();
                        return self.favoritesPoints;
                    }, function (response) {
                        //Second function handles error
                        self.updateFavoritesOrder.content = "Something went wrong";
                        // self.message = "Something went wrong"
                    });
            }

            //pointDown in DB and pointUp is in LS
            else if (self.favoritesPointsLS.find(x => x.pointId === pointUp.pointId)
                && self.favoritesPointsDB.find(x => x.pointId === pointDown.pointId)) {
                return self.updateFavoritesOrderPointsInLSAndDB(pointUp, pointDown);
            }

            //pointUp in DB and pointDown in LS
            else if (self.favoritesPointsLS.find(x => x.pointId === pointDown.pointId)
                && self.favoritesPointsDB.find(x => x.pointId === pointUp.pointId)) {
                return self.updateFavoritesOrderPointsInLSAndDB(pointDown, pointUp);
            }

        };

        self.setFavoritesBtnAnimation = function (timeline, el) {
            var scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
            // var el = angular.element(fav_btn);
            // mo.js timeline obj
            // timeline = new mojs.Timeline();

            // tweens for the animation:

            // burst animation
            tween1 = new mojs.Burst({
                parent: el,
                radius: {0: 50},
                angle: {0: 45},
                y: 40,
                x: -200,
                count: 10,
                radius: 50,
                children: {
                    shape: 'circle',
                    radius: 10,
                    fill: ['red', 'white'],
                    strokeWidth: 15,
                    duration: 500,
                }
            });


            tween2 = new mojs.Tween({
                duration: 900,
                onUpdate: function (progress) {
                    var scaleProgress = scaleCurve(progress);
                    el.style.WebkitTransform = el.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
                }
            });
            tween3 = new mojs.Burst({
                parent: el,
                radius: {0: 50},
                angle: {0: -45},
                y: 40,
                x: -200,
                count: 10,
                radius: 70,
                children: {
                    shape: 'circle',
                    radius: 10,
                    fill: ['white', 'red'],
                    strokeWidth: 15,
                    duration: 400,
                }
            });

            // add tweens to timeline:
            timeline.add(tween1, tween2, tween3);
        };

        self.sortByOrderNum = function () {
            self.favoritesPoints.sort((a, b) => a.orderNum - b.orderNum)
        };

        self.sortByCategory = function () {
            self.favoritesPoints.sort((a, b) => a.category > b.category)
        };

        self.sortByRating = function () {
            self.favoritesPoints.sort((a, b) => a.rating - b.rating)
        };

        self.sortBySavedDate = function () {
            self.favoritesPoints.sort((a, b) => a.savedDate - b.savedDate).reverse();
        };

        self.get2LastFavoritesPoints = function () {
            /*$http.get(serverUrl + "users/favoritesPoints/2Latest/userId/" + userID)
                .then(function (response) {
                    //First function handles success
                    if (response.data.length === 0) {
                        self.showMsgOfFavorites = true;
                        self.favoritesMsg = "You haven't saved any points yet";
                    }
                    else {
                        self.showMsgOfFavorites = false;
                        favoritesPointsService.getPointsByID(response.data, self.lastFavoritesPoints)
                            .then(function (favPoints) {
                                self.lastFavoritesPoints = favPoints;
                                console.log("getting 2 last favorites points" + self.lastFavoritesPoints);
                            })
                        // self.lastFavoritesPoints = response.data;
                    }
                }, function (response) {
                    //Second function handles error
                    self.get2LastFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });*/
            self.sortBySavedDate();
            return self.favoritesPoints.slice(0, 2);
        };

        self.initFavoritesArrays= function(){
            self.favoritesPointsLS = [];
            self.favoritesPointsDB = [];
            self.favoritesPoints = [];
        };

    }]);