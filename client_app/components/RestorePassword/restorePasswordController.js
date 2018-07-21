angular.module('pointsOfInterestApp')
    .controller('restorePasswordController', ['$scope', '$http', '$location', 'setHeadersToken', 'localStorageModel', 'loggedInUserID','$q', function ($scope, $http, $location, setHeadersToken, localStorageModel, loggedInUserID,$q) {

        var self = this;

        var serverUrl = "http://localhost:8080/";

        self.questions = {};
        self.answers = {};
        self.gotQuestions = false;
        self.gotWrongAnswer = false;
        self.gotPassword = false;
        self.password = null;

        self.getRestoreQuestions = function (userID) {
            $http.get(serverUrl + "users/qaRestorePassword/" + userID)
                .then(function (response) {
                    //First function handles success
                    self.questions = response.data;
                    self.gotQuestions = true;

                }, function (response) {
                    self.getAllPoints.content = response.data;
                    //Second function handles error
                    self.message = "Something went wrong"
                });
        };

        self.checkRestoreQA = function () {
            self.gotWrongAnswer = false;
            self.gotPassword = false;
            self.password = null;
            let arr = [];

            for (let i = 0; i < self.questions.length; i++) {
                qa = {'id': userID, 'question': self.questions[i].question, 'answer': self.answers[i]};
                arr.push($http.post(serverUrl + "users/qaRestorePassword/check", qa));
            }

            $q.all(arr)
                .then(function (results) {
                    // ret[0] contains the response of the first call
                    // ret[1] contains the second response
                    // etc.
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].data.length === 0) {
                            self.message = "Not the answer to question " + (i + 1) + " !";
                            self.gotWrongAnswer = true;
                            break;
                        } else {
                            self.password = results[i].data[0].password;
                        }
                    }

                    if (!self.gotWrongAnswer) {
                        self.gotPassword = true;
                        self.message = "Your Username is: " + self.username + " and your password is: " + self.password;
                    }
                });
        };

        userID = null;
        self.getUserID = function () {
            loggedInUserID.get(self.username)
                .then(function (result) {
                    if (result.userId !== null) {
                        self.getRestoreQuestions(result.userId);
                        self.message = "";
                        userID = result.userId;
                    }
                    else {
                        self.message = result.message;
                    }

                });
        };

    }]);