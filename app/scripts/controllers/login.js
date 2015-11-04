'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .controller('LoginCtrl', function ($scope, $location, authenticationService) {

  	  if (authenticationService.getToken()) {
  	    $location.path('/').replace();	
  	  }

      $scope.invalidCredentials = false;
      $scope.submit = function(isValid) {
      	  if (! isValid) {
      	  	return;
      	  }

      	  authenticationService.login($scope.email, $scope.password, '/', function() {
            // Error
            $scope.invalidCredentials = true;
            $scope.email = null;
            $scope.password = null;
            $scope.form.$setPristine(true);
          });
      };
  });
