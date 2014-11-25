'use strict';

angular.module('digiviewApp')
  .controller('MainCtrl', [ '$scope', 'SolrService', function ($scope, SolrService) {

      $scope.$on('search-results-updated', function() {
        $scope.results = SolrService.results;
      });

      $scope.loadMoreResults = function() {
          SolrService.nextPage();
      }

  }]);
