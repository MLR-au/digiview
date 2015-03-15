'use strict';

angular.module('digiviewApp')
  .directive('viewSet', [ '$window', '$location', '$anchorScroll', '$routeParams', '$http', 'HighlightService', 'SolrService', 
        function ($window, $location, $anchorScroll, $routeParams, $http, hs, SolrService) {
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
          scope.ready = false;

          // defaults
          scope.showFilmstrip = false;
          scope.showInformation = false;
          scope.showSpinner = true;

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
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height) * 0.90;
                  scope.filmstrip_height = $window.innerHeight - scope.navbar_height - scope.image_pane_height;
                  scope.image_height = scope.filmstrip_height * 0.8;
              } else {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height);
              }
          }
          sizeThePanels();

          scope.$on('search-results-updated', function(v,k) {
              scope.ready = true;
              scope.showSpinner = false;
              scope.data = SolrService.results.items[0].docs;

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

              scope.current = 0;
              
              // load the first in the set if it's a wildcard search otherwise let
              //   the matches routeine trigger the first load
              if (SolrService.term === '*') {
                scope.loadImage();
              }
          })
          scope.$on('matches-available', function(d) {
              if (SolrService.results.term !== '*' && SolrService.matches !== undefined) {
                // search term
                scope.term = SolrService.term;

                // no word search in action
                scope.matchedWords = [];
                angular.forEach(SolrService.matches, function(v,k) {
                  var m = v.text[0].match(/<em>(.*?)<\/em>/g);
                  angular.forEach(m, function(v,k) {
                      v = v.replace(/<em>/, '').replace(/<\/em>/, '');
                      if (scope.matchedWords.indexOf(v) === -1) {
                          scope.matchedWords.push(v);
                      }
                  });
                })

                scope.pageMatches = []
                var flattened = _.pluck(scope.data, 'id');
                angular.forEach(SolrService.matches, function(v,k) {
                    if (flattened.indexOf(k) !== -1) {
                        scope.pageMatches.push(flattened.indexOf(k) + 1);
                    }
                })

                // load the image
                scope.current = scope.pageMatches[0] - 1;
                scope.loadImage();
                
              }
          })
          //
          // THIS IS WHERE IT STARTS
          //
          if (SolrService.results.term === undefined) {
              // reload or back to app - this is undefined so go back to start page
              $window.location = '#/';
          } else {
              scope.groupId = SolrService.results.items[$routeParams.sequenceNo - SolrService.start - 1].docs[0].group;
              SolrService.search(0, scope.groupId);
          }

          scope.getWords = function(words) {
              $http.get(words).then(function(resp) {
                  var words = resp.data.words;
                  scope.highlights = [];
                  angular.forEach(scope.matchedWords, function(v,k) {
                      if (words[v] !== undefined) {
                          angular.forEach(words[v], function(i, j) {
                              var n = {
                                'word': v,
                                'top': parseInt(i.top),
                                'bottom': parseInt(i.bottom),
                                'left':  parseInt(i.left),
                                'right':  parseInt(i.right)
                              }
                              scope.highlights.push(n);
                          })
                      }
                  })
                  hs.storeMatchedWordsAndHighlights(resp.data.page, scope.matchedWords, scope.highlights);
              }, 
              function() {
              });
          }
          // handle an image selection
          scope.loadImage = function() {
              // get the words list and kick off the highlighting
              if (SolrService.term !== '*') {
                  scope.getWords(scope.data[scope.current].words);
              }

              scope.styleMap = {};
              var id = scope.current;
              scope.image = scope.data[id];
              scope.styleMap[id] = 'highlight-current';

              // show the image
              scope.show = true;

              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(scope.current);
              $anchorScroll();
              $location.hash(old);

              // toggle the pagination controls
              if (scope.data.length === 1) {
                  // show none
                  scope.showNext = false;
                  scope.showPrevious = false;
              } else if (scope.current === 0 && scope.data.length > 1) {
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
              scope.loadImage();
          }

          // page to previous image
          scope.previous = function() {
              scope.current -= 1;
              scope.loadImage();
          }

          // jump to first image
          scope.jumpToStart = function() {
              scope.current = 0;
              scope.loadImage();
          }

          // jump to last image
          scope.jumpToEnd = function() {
              scope.current = scope.data.length - 1;
              scope.loadImage();
          }

          // jump to page
          scope.jumpToPage = function(page) {
              scope.current = page;
              scope.loadImage();

              // only close the panel if it's open
              if (scope.showInformation) scope.toggleInformation();
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
