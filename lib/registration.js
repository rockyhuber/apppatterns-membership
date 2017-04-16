var User = require('../models/user');
var Application = require('../models/application');
var r = require('rethinkdb');
var assert = require('assert');

var RegResult = function () {
  var result = {
    success: false,
    message: null,
    user: null,
  };

  return result;
};

var validateInputs = function (app) {
  if (!app.email || !app.password) {
    app.setInvalid('Email and password are required');
  } else if (app.password !== app.confirm) {
    app.setInvalid('Passwords do not match bitchy yo');
  } else {
    // console.log(app);
    app.validate();

  }
};

var checkIfUserExists = function (app, next) {
  
  r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {

    // r.db('membership').table('users').insert([
    //   {email: 'rocky@rockyhuber.com'}
    // ]).run(conn, function (err, result) {
    //   if (err) throw err;
    //   console.log(JSON.stringify(result, null, 2));
    // });
    //

    r.db('membership').table('users').filter(r.row('email').eq(app.email)).
      run(conn, function (err, cursor) {
        assert.ok(err === null, err);
        if (err) throw err;
        cursor.toArray(function (err, results) {
          if (err) throw err;
          if (results) {
            console.log('email exits');
            app.setInvalid("Email alrady exists");
            next(null, app);
          }
        });
      });
    });

//   r2.db('membership').table('users').get().run().then(function(user) {
//   // ...
// }).error(handleError);
//
//     if (err) throw err;
//     connection = conn;
//   var exists = r.db('membership').table('users').getAll('radasdasdsa', { index: 'email' }).count().gt(0);
//   console.log(exists);
};


  // r.branch(
  //   r.db('membership').table('users').getAll(app.email, { index: 'email' }).count().gt(0),
  //   r.error('User exists'),
  //   r.db('membership').table('users').insert({ email:  })
  // );

// r.table('users').filter(r.row('email').eq(app.email)).
//     run(connection, function (err, cursor) {
//         if (err) throw err;
//         cursor.toArray(function (err, result) {
//             if (err) throw err;
//             console.log(JSON.stringify(result, null, 2));
//         });
//     });


exports.applyForMembership = function (args) {
  var regResult = new RegResult();
  var app = new Application(args);
  validateInputs(app);
  checkIfUserExists(app);

  // validate inputs
  // validate password and email
  // check to see if email exists
  // create new user
  // hash the password
  // create a log entry
  if (app.status == 'validated') {
    regResult.success = true;
    regResult.message = 'Welcome';
    regResult.user = new User(args);
    // console.log(regResult);
  };

  return regResult;
};
