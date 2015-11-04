'use strict';

angular.module('talkitudeClientApp')
  .controller('StatsCtrl', function ($scope, talks) {
    $scope.data_talks_vs_month = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    $scope.data_talks_vs_year = [[]];
    $scope.month_labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.year_labels = [];

    $scope.type_labels = [];
    $.each(talks.getTypes(), function(key, value) {
      $scope.type_labels.push(value);
    });

    $scope.data_talks_vs_type = [];
    for (var i = 0; i < $scope.type_labels.length; i++) {
      $scope.data_talks_vs_type.push(0);
    }

    talks.getTalks(function(talks) {
      var talks_vs_year = {};
      talks.forEach(function(talk) {
        var date = new Date(talk.date);
        $scope.data_talks_vs_month[0][date.getMonth()]++;

        if (date.getFullYear() in talks_vs_year) {
          talks_vs_year[date.getFullYear()]++;
        } else {
          talks_vs_year[date.getFullYear()] = 1;
        }

        $scope.data_talks_vs_type[$scope.type_labels.indexOf(talk.type)]++;
      });

      $.each(talks_vs_year, function(key, value) {
        $scope.year_labels.push(key);
        $scope.data_talks_vs_year[0].push(value);
      });
    }, function() {

    });

  });