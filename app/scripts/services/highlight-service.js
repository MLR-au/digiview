'use strict';

angular.module('digiviewApp')
  .service('HighlightService', [ '$rootScope', function HighlightService($rootScope) {


      function storeCurrentTransformationAndPosition(t, p) {
          hs.transform = t;
          hs.position = p;
          $rootScope.$broadcast('transform-updated');
      }

      function storeMatchedWordsAndHighlights(page, words, highlights) {
          hs.words = words;
          hs.highlights = highlights;
          hs.page = page;
          $rootScope.$broadcast('words-updated');
      }

      function getWordsAndHighlights() {
      }

      function getTransform() {
      }

      var hs = {
          storeCurrentTransformationAndPosition: storeCurrentTransformationAndPosition,
          storeMatchedWordsAndHighlights: storeMatchedWordsAndHighlights,
      }
      return hs;
  }]);
