var assert = require('assert');
var utility = require('../lib/utility');

// constructor pattern
var User = function (args) {
  assert.ok(args.email, 'Email is requried');
  var user = {};
  user.email = args.email;
  user.createdAt = args.createdAt || new Date();
  user.status = args.status || 'pending';
  user.signInCount = args.signInCount || 0;
  user.lastLogin = args.lastLogin || new Date();
  user.currentLoginAt = args.currentLoginAt || new Date();
  user.authenticationToken = args.authenticationToken || utility.randomString(18);
  return user;
};

module.exports = User;

// factory pattern
// User.createEmptyUser
// exports.createEmptyUser = function (args) {
//   var user = {};
//   user.email = args.email;
//   return user;
// };
