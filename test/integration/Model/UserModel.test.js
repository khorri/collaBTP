var expect = require('expect');
var should = require('should');
describe('UserModel', function() {

  describe('#find()', function() {
    it('should check find function', function (done) {
      User.find()
      .then(function(results) {
        results.should.be.an.instanceOf(Array);
          
        done();
      })
      .catch(done);
    });
  });

});