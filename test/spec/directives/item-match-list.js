'use strict';

describe('Directive: itemMatchList', function () {

  // load the directive's module
  beforeEach(module('digiviewApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<item-match-list></item-match-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the itemMatchList directive');
  }));
});
