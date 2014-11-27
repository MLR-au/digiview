'use strict';

angular.module('digiviewApp')
  .directive('smoothzoom', [ '$window', '$timeout', function ($window, $timeout) {
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
              });
          }

          scope.$watch('image_pane_height', function() {
              console.log('image pane height changed');
              element.smoothZoom('destroy');
              scope.init(); 
          })

          element.on('load', function() {
              scope.init(); 
          });

      }
    };
  }]);
