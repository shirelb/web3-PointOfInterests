angular.module('pointsOfInterestApp')
    // .controller('registerController', ['$scope', '$http','localStorageModel', function ($scope, $http,localStorageModel) {
    .controller('registerController', ['$scope', '$http', '$location', 'setHeadersToken', 'localStorageModel', function ($scope, $http, $location, setHeadersToken, localStorageModel) {

            var self = this;

        self.user = {};

        self.countries = ["Israel", "Spain", "USA"];

        self.categories = ["Club", "Art", "Attraction"];
        self.user.categories = []; //selected categories
        self.user.questions = []; //selected categories
        self.user.answers = []; //selected categories

        // toggle selection for a given category
        self.toggleCategorySelection = function (cName) {
            let idx = self.user.categories.indexOf(cName);
            if (idx > -1) {
                self.user.categories.splice(idx, 1);
            }
            else {
                self.user.categories.push(cName);
            }
        };

        self.register = function () {
            self.user.questions.push(self.user.restore_question);
            self.user.answers.push(self.user.restore_answer);
            console.log('User clicked submit with ', self.user);
            // register user
            /*let user = {
                "firstName": self.user.firstname,
                "lastName": self.user.lastname,
                "city": self.user.city,
                "country": self.user.country,
                "categories": self.user.categories,
                "username": self.user.username,
                "password": self.user.password,
                "email": self.user.email,
                "questions": [self.user.restore_question],
                "answers": [self.user.restore_answer]
            };*/
            let serverUrl = "http://localhost:8080/";
            $http.post(serverUrl + "users/add", self.user)
                .then(function (response) {
                    //First function handles success
                    self.register.content = response.data;
                    console.log("user added");
                    $location.path('/login');

                }, function (response) {
                    self.register.content = response.data;
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                    console.log("user added failed");
                    self.message = "Username already in use, please choose another one"
                });
        };

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);