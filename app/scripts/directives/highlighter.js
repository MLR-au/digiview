'use strict';

angular.module('digiviewApp')
  .directive('highlighter', [ '$timeout', 'HighlightService', function ($timeout, hs) {
    return {
      templateUrl: 'views/highlighter.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          scope.$on('words-updated', function() {
              scope.showHighlights = false;
              scope.words = hs.words;
              scope.highlights = hs.highlights;
              scope.page = hs.page;
              $timeout(function() {
                  scope.update();
              }, 1500);
          });

          scope.$on('transform-updated', function() {
              scope.showHighlights = false;
              scope.transform = hs.transform;
              scope.position = hs.position;
              $timeout(function() {
                  scope.update();
              }, 1500);
          });

          scope.$on('ditch-highlights', function() {
              scope.showHighlights = false;
          })

          scope.update = function() {
              scope.highlightBoxes = [];
              if (scope.transform === undefined || scope.highlights === undefined) {
                  return;
              }
              angular.forEach(scope.highlights, function(v,k) {
                  var ht = scope.transform.normHeight / scope.page.height,
                      wt = scope.transform.normWidth / scope.page.width;

                  var t = v.top * ht * scope.transform.ratio,
                      b = v.bottom * ht * scope.transform.ratio,
                      l = v.left * wt * scope.transform.ratio,
                      r = v.right * wt * scope.transform.ratio;  

                  var box = {
                      'position': 'fixed',
                      'background-color': 'yellow',
                      'z-index': 5000,
                      'opacity': 0.2,
                      'border-radius': '8px',
                      'top': t - (t * 0.015) + scope.position.top + 'px',
                      'left': l - (l * 0.015) + scope.position.left + 'px',
                      'width': r - l + (r * 0.03) + 'px',
                      'height': b - t + (b * 0.03) + 'px',
                  }
                  scope.highlightBoxes.push(box);
                  //console.log(scope.transform, scope.position);
                  //console.log(scope.highlightBoxes);
                  scope.showHighlights = true;
              })
          }

      }
    };
  }]);
