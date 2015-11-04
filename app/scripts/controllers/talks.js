'use strict';

/**
 * @ngdoc function
 * @name talkitudeClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkitudeClientApp
 */
angular.module('talkitudeClientApp')
  .directive('grid', function() {
      return {
          restrict: 'E',
          scope: {
            break: '=break',
            source: '=source'
          },
          controller: function($scope) {
            $scope.$watch('source', function() {
              var total = Math.ceil($scope.source.length / $scope.break);
              if (total === 0) {
                return;
              }

              $scope.data = new Array(total);
              for (var i = 0; i < total; ++i) {
                $scope.data[i] = $scope.source.slice(i * $scope.break, (i + 1) * $scope.break);
              }
            });
          },
          templateUrl: 'views/templates/grid.html',
          replace: true
      };
  })
  .controller('TalksCtrl', function ($scope, talks, $modal) {
    $scope.talkType = talks.getTypes();

    $scope.upload_status = {
      status: null
    };

    // Retrieve list of talks
    $scope.talks = [];
    $scope.getTalks = function() {
      talks.getTalks(function(talks) {
        $scope.talks = talks;
        $scope.filterTalks();
      }, function() {

      });
    };
    $scope.getTalks();

    $scope.numPerPage = 12;
    $scope.currentPage = 1;
    $scope.firstTalk = 0;
    $scope.lastTalk = 0;

    $scope.filterTalks = function() {
      $scope.filteredTalks = [];

      if (! $scope.talks.length) {
        return;
      }

      var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
      $scope.filteredTalks = $scope.talks.slice(begin, end);
      $scope.firstTalk = begin;
      $scope.lastTalk = Math.min($scope.talks.length, end);
    };

    $scope.$watch("currentPage + numPerPage", function() {
      $scope.filterTalks();
    });

    $scope.submit = function(isValid) {
      if (! isValid) {
        return;
      }

      // FIXME: Do validation
      $scope.upload_status.status = "uploading";

      // Use Upload service to upload file to remote server
      talks.newTalk($scope.talk, $scope.file, function (evt) {
        $scope.upload_status.status = "uploading";
        $scope.upload_status.data = parseInt(100.0 * evt.loaded / evt.total);
      },
      function () {
        $scope.upload_status.status = "success";

        $scope.talk = null;
        $scope.file = null;
        $scope.form.$setPristine(true);
      },
      function (data) {
        $scope.upload_status.status = "error";
        $scope.upload_status.data = data;
      });
    };

    $scope.download = function(talk) {
      talks.download(talk);
    };

    $scope.delete = function(talk) {
      $scope.talk = talk;
      $modal.open({
        animation: true,
        templateUrl: 'views/templates/delete_dialog.html',
        size: ''
      }).result.then(function() {
        talks.delete(talk).then(function() {
          $scope.talks.forEach(function (e, index, array) {
            if (e._id === talk._id) {
              array.splice(index, 1);
            }
          });

          $scope.filterTalks();
        });
      });
    };
  });
