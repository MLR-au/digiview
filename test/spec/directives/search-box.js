'use strict';

describe('Directive: searchBox', function () {

  // load the directive's module
  beforeEach(module('digiviewApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<search-box></search-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the searchBox directive');
  }));
});
