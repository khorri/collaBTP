describe('EmptyCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('#increment', function() {
    it('increment the param', function() {
      var $scope = {};
      var controller = $controller('emptyCtrl', { $scope: $scope });
      $scope.param = 0;
      $scope.increment();
      $scope.param.should.equal(1);
    });
  });
});