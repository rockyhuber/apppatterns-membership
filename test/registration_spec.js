var Registration = require('../lib/registration');

describe('Registration', function () {

  describe('a valid application', function () {

    var regResult = {};

    before(function () {
      regResult = Registration.applyForMembership(
        {
          email: 'rocky@rockyhuber.com',
          password: '1',
          confirm: '1',
        });
    });

    it('is successful', function () {
      regResult.success.should.equal(true);
    });

    it('creates a user', function () {
      regResult.user.should.be.defined;
    });

    it('create a log entry', function () {

    });

    it('sets the users status to approved', function () {

    });

    it('offers a welcome message', function () {

    });
  });

  describe('an empty or null email', function () {
    it('is not successful', function () {

    });

    it('tells the user that the email is requried', function () {

    });
  });

  describe('empty or null password', function () {
    it('is not successful', function () {

    });

    it('tells the user that the password is requried', function () {

    });
  });

  describe('password and confirm mismatch', function () {
    it('is not successful', function () {

    });

    it('tells that the passwords dont match', function () {

    });
  });

  describe('email already exists', function () {
    it('is not successful', function () {

    });

    it('tell the user that the email already exists', function () {

    });
  });
});
