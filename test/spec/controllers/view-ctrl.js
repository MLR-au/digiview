'use strict';

describe('Controller: ViewCtrlCtrl', function () {

  // load the controller's module
  beforeEach(module('digiviewApp'));

  var ViewCtrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewCtrlCtrl = $controller('ViewCtrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
