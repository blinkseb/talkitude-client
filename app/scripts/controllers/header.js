'use strict';

angular.module('talkitudeClientApp')
	.controller('HeadersCtrl', function ($scope, $location, authenticationService) {
		$scope.isActive = function (viewLocation) { 
        	return viewLocation === $location.path();
    	};

    	$scope.hasToken = function() {
    		return authenticationService.getToken() != null;
    	};
	});