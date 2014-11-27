'use strict';

angular.module('digiviewApp')
  .directive('viewSet', [ '$window', '$location', '$anchorScroll', '$timeout', '$routeParams', 'SolrService', 
        function ($window, $location, $anchorScroll, $timeout, $routeParams, SolrService) {
    return {
      templateUrl: 'views/view-set.html',
      restrict: 'E',
      scope: {
      },
      link: function postLink(scope, element, attrs) {
          scope.smallImages = [];
          scope.largeImageMap = {};
          scope.styleMap = {};
          scope.largeImageById = [];

          // defaults
          scope.showFilmstrip = true;
          scope.showInformation = false;

          scope.$on('search-results-updated', function(v,k) {
              scope.data = SolrService.results.items[0].docs;
              //
              // construct the data structure for the filmstrip
              angular.forEach(scope.data, function(v, k) {
                  scope.smallImages.push(
                      { 
                        'id': k,
                        'src': v.thumb_image
                      }
                  );
              });

              // load the first in the set
              scope.current = 0;
              scope.loadImage(scope.current);

          })
          if (SolrService.results.term === undefined) {
              $window.location = '#/';
          } else {
              var theOne = SolrService.results.items[$routeParams.sequenceNo-1];
              SolrService.search(SolrService.results.term, 0, true, theOne.docs[0].group);
          }

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
                scope.loadImage(scope.current);
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.navbar_height = 50;
              if (scope.showFilmstrip === true) {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height) * 0.80;
                  scope.filmstrip_height = $window.innerHeight - scope.navbar_height - scope.image_pane_height;
                  scope.image_height = scope.filmstrip_height * 0.9;
              } else {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height);
              }
          }
          sizeThePanels();


          // handle an image selection
          scope.loadImage = function(id) {
              if (scope.current !== id) {
                  scope.current = id;
              }
              var image = scope.data[id];
              scope.image = image.large_image;

              scope.show = false;
              scope.show = true;

              //scope.styleMap[scope.current] = '';
              //scope.styleMap[id] = 'highlight-current';
              //scope.current = id;
              //scope.displaying = (scope.largeImageById.indexOf(scope.current) + 1) + ' of ' + scope.largeImageById.length;

              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(scope.current);
              $anchorScroll();
              $location.hash(old);

              // toggle the pagination controls
              if (scope.current === 0 && scope.data.length > 1) {
                  // show next not previous
                  scope.showNext = true;
                  scope.showPrevious = false;
              } else if (scope.current === scope.data.length - 1 && scope.data.length > 1) {
                  // show previous not next
                  scope.showNext = false;
                  scope.showPrevious = true;
              } else {
                  // show both
                  scope.showNext = true;
                  scope.showPrevious = true;
              }
          }

          // page to next image
          scope.next = function() {
              scope.current += 1;
              scope.loadImage(scope.current);
          }
          // page to previous image
          scope.previous = function() {
              scope.current -= 1;
              scope.loadImage(scope.current);
          }

          // jump to first image
          scope.jumpToStart = function( ){
              scope.current = 0;
              scope.loadImage(scope.current);
          }

          // jump to last image
          scope.jumpToEnd = function( ){
              scope.current = scope.data.length - 1;
              scope.loadImage(scope.current);
          }
          
          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              scope.showFilmstrip = !scope.showFilmstrip;
              sizeThePanels();
          }

          // show the item information panel
          scope.toggleInformation = function() {
              scope.showInformation = !scope.showInformation;
          }

      }
    };
  }]);
