'use strict';

angular.module('digiviewApp')
  .controller('MainCtrl', [ '$scope', 'SolrService', function ($scope, SolrService) {

      $scope.disableNextButton = true;

      $scope.$on('search-results-updated', function() {
        $scope.results = SolrService.results;
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
          if (SolrService.start === 0) {
              $scope.disablePrevious = true;
          } else {
              $scope.disablePrevious = false;
          }

          if (SolrService.start + SolrService.rows >= $scope.results.total) {
              $scope.disableNext = true;
          } else {
              $scope.disableNext = false;
          }

      }

  }]);
