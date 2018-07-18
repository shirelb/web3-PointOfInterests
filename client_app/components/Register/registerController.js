angular.module('pointsOfInterestApp')
// .controller('registerController', ['$scope', '$http','localStorageModel', function ($scope, $http,localStorageModel) {
    .controller('registerController', ['$scope', '$http', '$location', 'setHeadersToken', 'localStorageModel', function ($scope, $http, $location, setHeadersToken, localStorageModel) {

        var self = this;

        var serverUrl = "http://localhost:8080/";

        self.getCountries = function () {
            $http.get(serverUrl + "countries")
                .then(function (response) {
                    //First function handles success
                    self.countries = response.data;
                }, function (response) {
                    //Second function handles error
                    self.getCountries.content = "Something went wrong";
                });
        };

        self.getCategories = function () {
            // var serverUrl = "http://localhost:8080/";
            $http.get(serverUrl + "categories")
                .then(function (response) {
                    //First function handles success
                    self.categories = response.data;
                }, function (response) {
                    //Second function handles error
                    self.getCategories.content = "Something went wrong";
                });
        };

        self.user = {};

        self.countries = [];
        self.getCountries();

        self.categories = [];
        self.getCategories();

        self.user.categories = []; //selected categories
        self.restoreQA = ["your qa here"]; //selected categories
        self.user.questions = []; //selected categories
        self.user.answers = []; //selected categories


        self.addRestoreQA = function () {
            var newItemNo = self.user.questions.length + 1;
            // if (self.user.questions[newItemNo - 1] !== undefined && self.user.answers[newItemNo - 1] !== undefined) {
            self.user.questions.push(self.user.questions[newItemNo - 1]);
            self.user.answers.push(self.user.answers[newItemNo - 1]);
            // }
            self.restoreQA.push("your qa here " + newItemNo);
        };

        self.removeRestoreQA = function () {
            var lastItem = self.user.questions.length - 1;
            self.user.questions.splice(lastItem, 1);
            self.user.answers.splice(lastItem, 1);
            self.restoreQA.pop();
        };

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
            if(self.user.categories.length<2){
                self.message="Choose at least 2 categories";
                return;
            }
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
            // let serverUrl = "http://localhost:8080/";
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