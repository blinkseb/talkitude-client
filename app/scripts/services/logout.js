'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .factory('logoutService', ['$rootScope', '$location', function ($rootScope, $location) {
    return function() {
      if ($rootScope.token === null) {
          $location.path('/login').replace();
          return;
       }

       $rootScope.token = null;
       $location.path('/login').replace();
    }
  	   
  }]);