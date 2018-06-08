angular.module('pointsOfInterestApp')
.service('setHeadersToken',[ '$http', function ($http) {

    let token = ""

    this.set = function (t) {
        token = t
        $http.defaults.headers.common[ 'x-access-token' ] = t
        // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
        console.log("set")

    }

    this.userName='shir'


}])
    .controller('registerController' ,['$scope','$http', function ($scope, $http) {
        var self = this;

        self.user={};

        self.countries = ["Israel", "Spain", "USA"];

        self.categories = ["Club", "Art", "Attraction"];
        self.user.categories = []; //selected categories

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

        self.reg = function () {
            // register user
            let user = {
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
            };
            let serverUrl = "http://localhost:3000/";
            $http.post(serverUrl + "users/add", user)
                .then(function (response) {
                    //First function handles success
                    self.reg.content = response.data;
                    console.log("user added");
                    $location.path('/login');

                }, function (response) {
                    self.reg.content = response.data
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                    console.log("user added faild");
                    self.message = "Username already in use, please choose another one"
                });
        };

        self.addTokenToLocalStorage = function () {
            localStorageModel.addLocalStorage('token', self.login.content)
        }

        self.submit = function () {
            console.log('User clicked submit with ', self.user);
            self.reg();
        };

        $scope.count = 0;
        $scope.myFunc = function () {
            $scope.count++;
        };
    }]);