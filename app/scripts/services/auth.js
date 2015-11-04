'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .factory('authenticationService', function ($rootScope, $location, localStorageService, base64, $log, $http, API_END_POINT) {

    var service = {};

    $rootScope.expiredToken = false;

    service.getToken = function() {
      var token = localStorageService.get('token');
      return token || null;
    };

    service.setToken = function(token) {
      localStorageService.set('token', token);
      $rootScope.token = token;

      if (token) {
        $rootScope.expiredToken = false;
      }
    };

    service.checkAndRedirect = function() {
      var token = service.getToken();
      if (! token) {
        // Redirect to the login page
        $location.path('/login').replace();
        return true;
      }

      return false;
    };

    service.logout = function() {
      // Clear token
      service.setToken(null);

      // Redirect to login page
      $location.path('/login').replace();
    };

    service.login = function(email, password, nextPath, errorCallback) {
      
      if (! nextPath) {
        nextPath = '/';
      }

      $http({ method: 'POST', url: API_END_POINT + '/token', headers: {'Authorization': 'Basic ' + base64.encode(email + ':' + password)},
        data: {grant_type: 'client_credentials'} })
      .success(function (data) {
        service.setToken(data.access_token);
        $location.path(nextPath).replace();
      })
      .error(function () {
        service.setToken(null);
        service.checkAndRedirect();
        errorCallback();
      });
    };

    service.getHeaders = function() {
      return {'Authorization': 'Bearer ' + service.getToken()};
    };

    service.checkError = function(status) {
      if (status === 400 || status === 401) {
        // Token invalid or expired
        $rootScope.expiredToken = true;
        service.setToken(null);
        service.checkAndRedirect();

        return true;
      }

      return false;
    };

    return {
      getToken: service.getToken,
      setToken: service.setToken,
      checkAndRedirect: service.checkAndRedirect,
      login: service.login,
      logout: service.logout,
      getHeaders: service.getHeaders,
      checkError: service.checkError
    };
  	   
  });