'use strict';

/**
 * @ngdoc service
 * @name Configuration
 * @description
 *  Configuration object for the app.
 */
angular.module('digiviewApp')
  .constant('Configuration', {
      production:               'http://115.146.84.251',
      testing:                  'http://115.146.84.251',
      loglevel:                 'DEBUG',
      deployment:               'testing',
      allowedRouteParams:       [  ],
      site:                     'DCVW',
      keywordSearchOperator:    'AND',
      datasetStart:             '2000-01-01T00:00:00Z',
      datasetEnd:               '2014-12-31T23:59:59Z'
  });
