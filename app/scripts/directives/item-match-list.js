'use strict';

angular.module('digiviewApp')
  .directive('itemMatchList', [ 'SolrService', function (SolrService) {
    return {
      templateUrl: 'views/item-match-list.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          scope.$on('search-results-updated', function() {
              scope.items = SolrService.results.items;
          });
      }
    };
  }]);
