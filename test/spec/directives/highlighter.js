'use strict';

describe('Directive: highlighter', function () {

  // load the directive's module
  beforeEach(module('digiviewApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<highlighter></highlighter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the highlighter directive');
  }));
});
