'use strict';

angular.module('digiviewApp')
  .controller('MainCtrl', [ '$scope', 'SolrService', function ($scope, SolrService) {

      $scope.disableNextButton = true;

      $scope.$on('search-results-updated', function() {
        $scope.results = SolrService.results;
        if ($scope.results.items.length === $scope.results.totalGroups) {
            $scope.disableNextButton = true;
        } else {
            $scope.disableNextButton = false;
        }
      });

      $scope.loadMoreResults = function() {
          SolrService.nextPage();
      }

  }]);
