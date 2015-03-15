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
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height) * 0.80;
                  scope.filmstrip_height = $window.innerHeight - scope.navbar_height - scope.image_pane_height;
                  scope.image_height = scope.filmstrip_height * 0.9;
              } else {
                  scope.image_pane_height = ($window.innerHeight - scope.navbar_height);
              }
          }
          sizeThePanels();

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

          var highlightWordMatches = function(words) {
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
          }
          scope.$on('search-results-updated', function(v,k) {
              scope.ready = true;
              scope.showSpinner = false;
              if (SolrService.results.term !== '*') {
                  // no word search in action
                  extractWordMatches(SolrService.results.highlighting);
                  scope.highlighting = SolrService.results.highlighting;
              }
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
              scope.getWordsAndLoadImage();
          })
          //
          // THIS IS WHERE IT STARTS
          //
          if (SolrService.results.term === undefined) {
              $window.location = '#/';
          } else {
              console.log(SolrService.results.items);
              scope.groupId = SolrService.results.items[$routeParams.sequenceNo - SolrService.start - 1].docs[0].group;
              SolrService.search(0, true, scope.groupId);
          }

          scope.getWordsAndLoadImage = function() {
              if (SolrService.results.term !== '*') {
                  var url = scope.data[scope.current].words;
                  $http.get(url).then(function(resp) {
                      highlightWordMatches(resp.data.words);
                      hs.storeMatchedWordsAndHighlights(resp.data.page, scope.matchedWords, scope.highlights);
                      scope.loadImage();
                  }, 
                  function() {
                  });
              } else {
                  // if we're not searching - just load the image
                  scope.loadImage();
              }
          }
          // handle an image selection
          scope.loadImage = function() {
              scope.styleMap = {};
              var id = scope.current;
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
              scope.getWordsAndLoadImage();
          }

          // page to previous image
          scope.previous = function() {
              scope.current -= 1;
              scope.getWordsAndLoadImage();
          }

          // jump to first image
          scope.jumpToStart = function() {
              scope.current = 0;
              scope.getWordsAndLoadImage();
          }

          // jump to last image
          scope.jumpToEnd = function() {
              scope.current = scope.data.length - 1;
              scope.getWordsAndLoadImage();
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
