'use strict';

/**
 * @ngdoc overview
 * @name talkitudeClientApp
 * @description
 * # talkitudeClientApp
 *
 * Main module of the application.
 */
angular
  .module('talkitudeClientApp', [
    'configuration',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ab-base64',
    'LocalStorageModule',
    'datePicker',
    'ui.bootstrap',
    'ngFileUpload',
    'chart.js'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'TalksCtrl',
        controllerAs: 'main'
      })
      .when('/talk/new', {
        templateUrl: 'views/new_talk.html',
        controller: 'TalksCtrl'
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
            resolve: {
                logout: ['authenticationService', function (authenticationService) {
                    authenticationService.logout();
                }]
            },
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
      localStorageServiceProvider.setPrefix('talkitude');
  }])
  .run(function ($rootScope, $location, $log, authenticationService) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next) {
      if (authenticationService.getToken() === null) {
        $log.info('No token, going to login page');
        // no logged user, we should be going to #login
        if (next.templateUrl === "views/login.html") {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path("/login").replace();
        }
      }
    });
 });
