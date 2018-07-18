var app = angular.module('pointsOfInterestApp', ["ngRoute", "LocalStorageModule","ngDialog"]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {


    $locationProvider.hashPrefix('');


    $routeProvider
        .when('/', {
            templateUrl: 'client_app/components/Home/home.html',
            controller: 'homeController as homeCtrl'
        })
        .when('/about', {
            templateUrl: 'client_app/components/About/about.html',
            controller: 'aboutController as aboutCtrl'
        })
        .when('/register', {
            templateUrl: 'client_app/components/Register/register.html',
            controller: 'registerController as registerCtrl'
        })
        .when('/login', {
            templateUrl: 'client_app/components/Login/login.html',
            controller: 'loginController as loginCtrl'
        })
        .when('/pointsOfInterests', {
            templateUrl: 'client_app/components/PointsOfInterest/pointsOfInterest.html',
            controller: 'pointsOfInterestController as poiCtrl'
        })
        .when('/favoritesPointsOfInterest', {
            templateUrl: 'client_app/components/FavoritesPointsOfInterest/favoritesPointsOfInterest.html',
            controller: 'favoritesPointsOfInterestController as f_poiCtrl'
        })

        .when('/restorePassword', {
            templateUrl: 'client_app/components/RestorePassword/restorePassword.html',
            controller: 'restorePasswordController as restorePwdCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);