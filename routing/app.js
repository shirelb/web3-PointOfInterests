let app = angular.module('pointsOfInterestApp', ["ngRoute","LocalStorageModule"]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {


    $locationProvider.hashPrefix('');


    $routeProvider
        .when('/', {
            templateUrl: 'components/Home/home.html',
            controller: 'homeController as homeCtrl'
        })
        .when('/about', {
            templateUrl: 'components/About/about.html',
            controller: 'aboutController as aboutCtrl'
        })
        .when('/register', {
            templateUrl: 'components/Register/register.html',
            controller: 'registerController as registerCtrl'
        })
        .when('/login', {
            templateUrl: 'components/Login/login.html',
            controller: 'loginController as loginCtrl'
        })
        .when('/pointsOfInterests', {
            templateUrl: 'components/PointsOfInterest/pointsOfInterest.html',
            controller: 'pointsOfInterestController as poiCtrl'
        })
        .when('/favoritesPointsOfInterest', {
            templateUrl: 'components/FavoritesPointsOfInterest/favoritesPointsOfInterest.html',
            controller: 'favoritesPointsOfInterestController as f_poiCtrl'
        })
        .when('/pointPage', {
            templateUrl: 'components/PointPage/pointPage.html',
            controller: 'pointPageController as pointCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);