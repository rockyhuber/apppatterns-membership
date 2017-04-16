var should = require('should');
var User = require('../models/user');

describe('User', function () {
  describe('defaults', function () {
    var user = {};
    before(function () {
      user = new User({ email: 'robert@rekordio.com' });
    });

    it('email is robert@rekordio.com', function () {
      user.email.should.equal('robert@rekordio.com');
    });

    it('has an authentication token', function () {
      user.authenticationToken.should.be.defined;
    });

    it('has a pending status', function () {
      user.status.should.equal('pending');
    });

    it('has created a due date', function () {
      user.createdAt.should.be.defined;
    });

    it('has a signInCount of 0', function () {
      user.signInCount.should.equal(0);
    });

    it('has lastLogin', function () {
      user.lastLogin.should.be.defined;
    });

    it('has currentLoginAt', function () {
      user.currentLoginAt.should.be.defined;
    });

  });
});
