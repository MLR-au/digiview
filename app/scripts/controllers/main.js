'use strict';

angular.module('digiviewApp')
  .controller('MainCtrl', [ '$scope', 'SolrService', function ($scope, SolrService) {

      $scope.$on('search-results-updated', function() {
        $scope.results = SolrService.results;
        console.log($scope.results);
        $scope.togglePageControls();
      });

      $scope.nextPage = function() {
          $scope.results = false;
          SolrService.nextPage();
      };
      $scope.previousPage = function() {
          $scope.results = false;
          SolrService.previousPage();
      };
      $scope.togglePageControls = function() {
          $scope.disablePrevious = true;
          $scope.disableNext = true;

          if (SolrService.start === 0) {
              $scope.disablePrevious = true;
          } else {
              $scope.disablePrevious = false;
          }

          if (SolrService.start + SolrService.rows >= $scope.results.totalGroups) {
              $scope.disableNext = true;
          } else {
              $scope.disableNext = false;
          }

      }

  }]);
