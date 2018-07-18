angular.module('pointsOfInterestApp')
    .service('loggedInUserID', ['$http', function ($http) {
        this.userID = null;

        var serverUrl = "http://localhost:8080/";
        this.get = function (username) {
            return $http.get(serverUrl + "users/username/" + username)
                .then(function (response) {
                    //First function handles success
                    // self.getAllPoints.content = response.data;
                    if (response.data.length === 0) {
                        // console.log("No such username");
                        return {userId: null, message: "No such username"};
                    }
                    else {
                        this.userID = response.data[0].userId;
                        return {userId: this.userID, message: "success"};
                    }

                    // console.log("getting all points" + self.points);
                }, function (response) {
                    // self.getAllPoints.content = response.data;
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                    // console.log("getting all points faild");
                    console.log("Something went wrong");
                    return response;
                });
        };

    }]);

