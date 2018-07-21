angular.module('pointsOfInterestApp')
    .service('loggedInUserID', ['$http', function ($http) {
        this.userID = null;

        var serverUrl = "http://localhost:8080/";
        this.get = function (username) {
            return $http.get(serverUrl + "users/username/" + username)
                .then(function (response) {
                    //First function handles success
                    if (response.data.length === 0) {
                        return {userId: null, message: "No such username"};
                    }
                    else {
                        this.userID = response.data[0].userId;
                        return {userId: this.userID, message: "success"};
                    }

                }, function (response) {
                    
                    console.log("Something went wrong");
                    return response;
                });
        };

    }]);

