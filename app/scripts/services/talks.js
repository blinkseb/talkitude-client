'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .factory('talks', function ($http, $q, $sce, authenticationService, Upload, API_END_POINT) {

    var service = {};

    service.getTypes = function() {
      return {
        'cms_meeting': 'CMS meeting',
        'cms_workshop': 'CMS workshop',
        'public_national': 'National conference (public)',
        'public_international': 'International conference (public)',
        'internal': 'Internal (private)',
        'other': 'Other'
      };
    };

    service.getTalks = function(callback, error) {
      $http({ method: 'GET', url: API_END_POINT + '/talks', headers: authenticationService.getHeaders() })
      .success(function (data) {
        var types = service.getTypes();
        data.forEach(function(e, index) {
          data[index].type = types[e.type];
        });

        // Sort talk by date
        data.sort(function (a, b) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        callback(data);
      })
      .error(function (data, status) {
        authenticationService.checkError(status);
        error(data);
      });
    };

    service.delete = function(talk) {
      var deferred = $q.defer();

      $http({ method: 'DELETE', url: API_END_POINT + '/talk/' + talk._id, headers: authenticationService.getHeaders() })
      .success(function (data) {
        deferred.resolve(data);
      })
      .error(function (data, status) {
        authenticationService.checkError(status);
        deferred.reject(data);
      });

      return deferred.promise;
    };

    service.newTalk = function (talk, file, progress, success, error) {
      Upload.upload({
        url: API_END_POINT + '/talk',
        headers: authenticationService.getHeaders(),
        fileFormDataName: 'file',
        sendFieldsAs: 'form',
        fields: talk,
        file: file
      })
      .progress(progress)
      .success(success)
      .error(function(data, status) {
        authenticationService.checkError(status);
        error(data, status);
      });
    };

    service.download = function(talk) {
      $http({ method: 'GET', url: API_END_POINT + '/download/' + talk.file._id, headers: authenticationService.getHeaders(), responseType: 'arraybuffer' })
      .success(function (data) {

        // Create a dummy a tag for downloading the file
        var fileName = talk.file.filename;
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        var file = new Blob([data], {type: 'application/pdf'});
        var fileURL = URL.createObjectURL(file);
        a.href = $sce.trustAsResourceUrl(fileURL);
        a.download = fileName;
        a.click();
      })
      .error(function (data, status) {
        authenticationService.checkError(status);
      });
    };

    return {
      getTypes: service.getTypes,
      getTalks: service.getTalks,
      delete: service.delete,
      newTalk: service.newTalk,
      download: service.download
    };
  });