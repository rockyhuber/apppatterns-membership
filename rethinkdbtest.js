var r = require('rethinkdb');
var assert = require('assert');

//connect to RethinkDB
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;

  // args...


// by default, arguments isnt a real array, you can get the length however
// ...arguments --> creates a genuine array
// convert arguments to a real array

// var args = Array.prototype.slice.call(arguments);
// var args = [].slice.call(arguments);
// var args = Array.from(arguments);
// var args = [...arguments];

  // create membership if it doesnt exist
  var generateO = function () {
    arguments = Array.prototype.slice.call(arguments);
    var dbName = arguments[0];

    r.dbList().contains(dbName)
      .do(function (databaseExists) {
        return r.branch(
          databaseExists,
          { dbs_created: 0 },
          r.dbCreate(dbName)
        );
      }).run(conn, (err, result) => {
        if (result.dbs_created === 1) {
          // if no database exists, message user
          console.log(`Database created: ${dbName}`);
        } else {
          // if database exists, message user
          console.log(`Database already exists: ${dbName}`);
        }
      });

    for (var i = 1; i < arguments.length; i++) {
      var table = arguments[i];
      (function (table) {
          // rethinkdb + result returns an array
          r.db(dbName).tableList().run(conn, (err, result) => {
            if (result.includes(table)) { // search the array with es6 includes
              console.log(`Table name already exists: ${table}`);
            } else {
              r.db(dbName).tableCreate(table).run(conn, function (err, result) { // rethinkdb syntax
                console.log(`Table created: ${table}`);
              });
            };
          });
        }(table)); // iife
    }
    // for (var i = 1; i < arguments.length; i++) {
    //   var table = arguments[i];
    //   (function (table) {
    //       // rethinkdb + result returns an array
    //       r.db(dbName).tableList().run(conn, (err, result) => {
    //         if (result.includes(table)) { // search the array with es6 includes
    //           console.log(`Table name already exists: ${table}`);
    //         } else {
    //           r.db(dbName).tableCreate(table).run(conn, function (err, result) { // rethinkdb syntax
    //             console.log(`Table created: ${table}`);
    //           });
    //         };
    //       });
    //     }(table)); // iife
    // }
  };

  generateO('membership2', 'users', 'logs', 'sessions', 'froggy');

});
