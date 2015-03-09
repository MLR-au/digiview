'use strict';

angular.module('digiviewApp')
  .directive('smoothzoom', [ '$rootScope', '$window', 'HighlightService', function ($rootScope, $window, hs) {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

          scope.init = function() {
              element.smoothZoom({
                  animation_SPEED_ZOOM: 0.5,
                  animation_SPEED_PAN: 0.5,
                  animation_SMOOTHNESS: 5, 
                  zoom_MAX: 100,
                  background_COLOR: 'black',
                  button_ALIGN: 'top right',
                  button_AUTO_HIDE: true,
                  button_SIZE: 26,
                  responsive: true,
                  on_ZOOM_PAN_START: function() {
                      scope.$apply(function() {
                          $rootScope.$broadcast('ditch-highlights');
                      });
                  },
                  on_ZOOM_PAN_COMPLETE: function(t) {
                      scope.$apply(function(d) {
                          hs.storeCurrentTransformationAndPosition(t, element[0].getBoundingClientRect());
                      });
                  }
              });
              //console.log(element);
              //console.log(element.smoothZoom('getZoomData'));
          }

          scope.$watch('image_pane_height', function() {
              element.smoothZoom('destroy');
              scope.init(); 
          })

          element.on('load', function() {
              scope.init(); 
          });

      }
    };
  }]);
