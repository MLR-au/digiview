'use strict';

angular.module('digiviewApp')
  .directive('viewSet', [ '$window', '$location', '$anchorScroll', '$timeout', '$routeParams', '$http', 'SolrService', 
        function ($window, $location, $anchorScroll, $timeout, $routeParams, $http, SolrService) {
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

          var extractWordMatches = function(h) {
              scope.matchedWords = [];
              angular.forEach(h, function(v,k) {
                  var m = v.text[0].match(/<em>(.*?)<\/em>/g);
                  angular.forEach(m, function(v,k) {
                      v = v.replace(/<em>/, '').replace(/<\/em>/, '');
                      if (scope.matchedWords.indexOf(v) === -1) {
                          scope.matchedWords.push(v);
                      }
                  });
              })
          }

          scope.$on('search-results-updated', function(v,k) {
              extractWordMatches(SolrService.results.highlighting);
              scope.highlighting = SolrService.results.highlighting;
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
                  scope.styleMap[k] = '';
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

          var getWordsFile = function(url) {
              $http.get(url).then(function(resp) {
                  scope.wordCoords = resp.data;
                  highlightWordMatches();
              }, 
              function() {
              });
          }

          var highlightWordMatches = function() {
              scope.highlights = [];
              angular.forEach(scope.matchedWords, function(v,k) {
                  if (scope.wordCoords[v] !== undefined) {
                      angular.forEach(scope.wordCoords[v], function(i, j) {
                          var n = {
                            'top': parseInt(i.top),
                            'bottom': parseInt(i.bottom),
                            'left':  parseInt(i.left),
                            'right':  parseInt(i.right)
                          }
                          scope.highlights.push(n);
                      })
                  }
              })
          }


          // handle an image selection
          scope.loadImage = function(id) {
              console.log(scope.matchedWords);
              getWordsFile(scope.data[id].words);
              scope.styleMap = {};
              if (scope.current !== id) {
                  scope.current = id;
              }
              scope.image = scope.data[id];
              scope.styleMap[id] = 'highlight-current';

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
          scope.jumpToStart = function() {
              scope.current = 0;
              scope.loadImage(scope.current);
          }

          // jump to last image
          scope.jumpToEnd = function() {
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
