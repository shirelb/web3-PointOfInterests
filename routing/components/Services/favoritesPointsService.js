angular.module("pointsOfInterestApp")
    .service('favoritesPointsService', ['$http', '$q', 'localStorageModel', function ($http, $q, localStorageModel) {

        let self = this;

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

        self.getAllFavoritesPoints = function () {
            return $http.get(serverUrl + "users/favoritesPoints/userId/" + self.userID)//was self.user
                .then(function (response) {
                    //First function handles success
                    if (response.data.length !== 0) {
                        return self.getPointsByID(response.data, self.favoritesPoints)
                            .then(function (favPoints) {
                                self.favoritesPoints = angular.merge(favPoints, response.data);
                                // self.favoritesPoints = favPoints;
                                localStorageModel.updateLocalStorage('favoritesPoints', self.favoritesPoints);
                                console.log("getting favorites points" + self.favoritesPoints);
                            })
                    }
                }, function (response) {
                    //Second function handles error
                    self.getAllFavoritesPoints.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.addPointToFavorites = function (point) {
            favPoint = {
                'userId': self.userID,
                'pointId': point.pointId,
                'orderNum': self.favoritesPoints.length,
                'savedDate': new Date()
            };
            return $http.post(serverUrl + "users/favoritesPoints/add", favPoint)//was self.user
                .then(function (response) {
                    //First function handles success
                    //add point to the array
                    self.favoritesPoints.push(point);
                    localStorageModel.updateLocalStorage('favoritesPoints', self.favoritesPoints);
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.addPointToFavorites.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.removePointFromFavorites = function (point) {
            return $http.delete(serverUrl + "users/favoritesPoints/remove/userId/" + self.userID + "/pointId/" + point.pointId)//was self.user
                .then(function (response) {
                    //First function handles success
                    //remove the point from the array
                    self.favoritesPoints.splice(
                        self.favoritesPoints.findIndex(
                            (p) => p.pointId === point.pointId
                        ), 1
                    );
                    localStorageModel.updateLocalStorage('favoritesPoints', self.favoritesPoints);
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.removePointFromFavorites.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
        };

        self.updateFavoritesOrder = function (pointUp, pointDown) {
            let arr = [];

            let updatedPointUp = {'orderNum': pointDown.orderNum, 'userId': pointUp.userId, 'pointId': pointUp.pointId};
            arr.push($http.put(serverUrl + "users/favoritesPoints/update/", updatedPointUp));

            let updatedPointDown = {
                'orderNum': pointUp.orderNum,
                'userId': pointDown.userId,
                'pointId': pointDown.pointId
            };
            arr.push($http.put(serverUrl + "users/favoritesPoints/update/", updatedPointDown));

            return $q.all(arr)
                .then(function (results) {
                    let orderNumTemp = pointUp.orderNum;
                    // pointUp.orderNum = pointDown.orderNum;
                    // pointDown.orderNum = orderNumTemp;

                    self.favoritesPoints[self.favoritesPoints.findIndex((p) => p.pointId === pointUp.pointId)].orderNum = pointDown.orderNum;

                    self.favoritesPoints[self.favoritesPoints.findIndex((p) => p.pointId === pointDown.pointId)].orderNum = orderNumTemp;

                    self.sortByOrderNum();
                    return self.favoritesPoints;
                }, function (response) {
                    //Second function handles error
                    self.updateFavoritesOrder.content = "Something went wrong";
                    // self.message = "Something went wrong"
                });
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
                radius:   { 0: 50 },
                angle:    { 0: 45 },
                y: 40,
                x:-200,
                count:    10,
                radius:       50,
                children: {
                    shape:        'circle',
                    radius:       10,
                    fill:         [ 'red', 'white' ],
                    strokeWidth:  15,
                    duration:     500,
                }
            });


            tween2 = new mojs.Tween({
                duration : 900,
                onUpdate: function(progress) {
                    var scaleProgress = scaleCurve(progress);
                    el.style.WebkitTransform = el.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
                }
            });
            tween3 = new mojs.Burst({
                parent: el,
                radius:   { 0: 50 },
                angle:    { 0: -45 },
                y: 40,
                x:-200,
                count:    10,
                radius:       70,
                children: {
                    shape:        'circle',
                    radius:       10,
                    fill:         [ 'white', 'red' ],
                    strokeWidth:  15,
                    duration:     400,
                }
            });

            // add tweens to timeline:
            timeline.add(tween1, tween2, tween3);
        };

        self.sortByOrderNum=function () {
            self.favoritesPoints.sort((a, b) => a.orderNum - b.orderNum)
        };

        self.sortByCategory=function () {
            self.favoritesPoints.sort((a, b) => a.category > b.category)
        };

        self.sortByRating=function () {
            self.favoritesPoints.sort((a, b) => a.rating - b.rating)
        };


    }]);