angular.module("pointsOfInterestApp")
    .service('reviewPointsService', ['$http', '$q', 'localStorageModel', function ($http, $q, localStorageModel) {

        let self = this;

        self.userID = null;
        self.setUserID = function (userID) {
            self.userID = userID;
        };

        var serverUrl = "http://localhost:8080/";

        self.getReviewByUserIdAndPointId = function (point) {
            return $http.get(serverUrl + "reviews/userId/" + self.userID)
                .then(function (response) {
                    //First function handles success
                    if (response.data.length !== 0) {
                        return response.data.filter(p => (p.pointId === point.pointId))[0];
                    }
                    else {
                        return response.data;
                    }
                }, function (response) {
                    //Second function handles error
                    self.getReviewByUserIdAndPointId.content = "Something went wrong";
                    return self.getReviewByUserIdAndPointId.content;
                    // self.message = "Something went wrong"
                });
        };

        self.addReviewRate = function (point, reviewRate) {
            rate = {
                'userId': self.userID,
                'pointId': point.pointId,
                'rate': reviewRate
            };

            return $http.post(serverUrl + "reviews/add/rate", rate)//was self.user
                .then(function (response) {
                    //First function handles success
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.addReviewRate.content = "Something went wrong";
                    return self.addReviewRate.content;
                    // self.message = "Something went wrong"
                });
        };

        self.addReviewMsg = function (point, reviewMsg) {
            review = {
                'userId': self.userID,
                'pointId': point.pointId,
                'reviewMsg': reviewMsg,
                'reviewDate': new Date()
            };

            return $http.post(serverUrl + "reviews/add/reviewMsg", review)//was self.user
                .then(function (response) {
                    //First function handles success
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.addReviewMsg.content = "Something went wrong";
                    return self.addReviewMsg.content;
                    // self.message = "Something went wrong"
                });
        };

        self.updateReviewRate = function (point, reviewRate) {
            rate = {
                'userId': self.userID,
                'pointId': point.pointId,
                'rate': reviewRate
            };

            return $http.put(serverUrl + "reviews/update/rate", rate)//was self.user
                .then(function (response) {
                    //First function handles success
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.updateReviewRate.content = "Something went wrong";
                    return self.updateReviewRate.content;
                    // self.message = "Something went wrong"
                });
        };

        self.updateReviewMsg = function (point, reviewMsg) {
            review = {
                'userId': self.userID,
                'pointId': point.pointId,
                'reviewMsg': reviewMsg,
                'reviewDate': new Date()
            };

            // review.reviewDate=review.reviewDate.toString();

            return $http.put(serverUrl + "reviews/update/reviewMsg", review)//was self.user
                .then(function (response) {
                    //First function handles success
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    self.updateReviewMsg.content = "Something went wrong";
                    return self.updateReviewMsg.content;
                    // self.message = "Something went wrong"
                });
        };

        self.getPointLastReviews = function (point) {
           return $http.get(serverUrl + "reviews/2Latest/pointId/" + point.pointId)
                .then(function (results) {
                    return results.data;
                }, function (response) {
                    //Second function handles error
                    self.getPointLastReviews.content = "Something went wrong";
                    return self.getPointLastReviews.content;
                });
        };

        self.get2LatestReviews = function (point) {
            return $http.get(serverUrl + "reviews/2Latest/pointId/" + point.pointId)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    //Second function handles error
                    console.log("Something went wrong with bringing 2 latest reviews ");
                });

        };

    }]);