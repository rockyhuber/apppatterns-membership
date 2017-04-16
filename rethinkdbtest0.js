var r = require('rethinkdb');
var assert = require('assert');

//connect to RethinkDB
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;

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
    };

  };

  generateO('membership', 'users', 'logs', 'sessions', 'froggy');

  //
  // r.table('membership').filter(r.row('email').eq('app.email')).
  //   run(conn, function(err, cursor) {
  //     console.log(cursor);
  //     if (err) throw err;
  //     cursor.toArray(function(err, result) {
  //       if (err) throw err;
  //       console.log(JSON.stringify(result, null, 2));
  //     });
  //   });
});
