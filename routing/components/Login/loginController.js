angular.module('pointsOfInterestApp')
.service('setHeadersToken',[ '$http', function ($http) {
    
    let token = ""

    this.set = function (t) {
        token = t;
        $http.defaults.headers.common[ 'x-access-token' ] = t;
        // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
        console.log("set");

    }

    //this.userName='shir';  


}])
.service('localStorageModel', function () { /* ... */ })
.controller('loginController',['$scope','$http','$location', 'setHeadersToken','localStorageModel' , function($scope,$http,$location, setHeadersToken,localStorageModel) {
    var self = this;

    self.submit = function () {
        console.log('User clicked submit with ', self.user);
        self.login();
    };

    $scope.count = 0;
    $scope.myFunc = function() {
      $scope.count++;
    };

   

    self.login = function () {
      // register user
      var serverUrl = "http://localhost:3000/";
      //$http.post(serverUrl + "users/login/authenticate", {"username": "admiin", "password": "admin2018"})//was self.user
      $http.post(serverUrl + "users/login/authenticate", {"username": self.user.username, "password": self.user.password})//was self.user
          .then(function (response) {
              //First function handles success
              if(response.data.success==="false"){
                  console.log("no such user: "+ response.data.message);
                  self.message = response.data.message;
                  $location.path('/login');
              }
                  else{
                    console.log("user: "+ response.data.message);
                    self.login.content = response.data.token;
                    self.message = response.data.message;
                    setHeadersToken.set(self.login.content);
                    self.addTokenToLocalStorage();
                    $location.path('/');
                  }

          }, function (response) {
              //Second function handles error
              self.login.content = "Something went wrong";
          });
    };

    self.addTokenToLocalStorage = function () {
        localStorageModel.addLocalStorage('token', self.login.content)
    }

  }]);