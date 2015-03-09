'use strict';

describe('Service: highlighterService', function () {

  // load the service's module
  beforeEach(module('digiviewApp'));

  // instantiate service
  var highlighterService;
  beforeEach(inject(function (_highlighterService_) {
    highlighterService = _highlighterService_;
  }));

  it('should do something', function () {
    expect(!!highlighterService).toBe(true);
  });

});
