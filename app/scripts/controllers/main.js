'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .controller('MainCtrl', function ($scope, $http, $log, authenticationService) {

  	$http({ method: 'GET', url: 'http://localhost:8080/talks', headers: authenticationService.getHeaders() })
      .success(function (data, status, headers, config) {
        $log.debug(data);

        $scope.talks = [
      		'OK!'
    	];
      })
      .error(function (data, status, headers, config) {
        $log.debug(data);

        $scope.talks = [
      		':(!'
    	];
      });

    
  });
