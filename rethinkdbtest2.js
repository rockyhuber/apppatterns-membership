var r = require('rethinkdb');
var assert = require('assert');

//connect to RethinkDB
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;

  // create membership databse
  // r.dbCreate('membership').run(conn, (err, result) => {
  //   if (err) {
  //     console.log('Database already exists');
  //   } else {
  //     console.log('Database created');
  //     console.log(JSON.stringify(result, null, 2));
  //   }
  // });

  // create membership if it doesnt exist
  var generateO = function (databaseName, tableName) {
    r.dbList().contains(databaseName)
      .do(function (databaseExists) {
        return r.branch(
          databaseExists,
          { dbs_created: 0 },
          r.dbCreate(databaseName)
        );
      }).run(conn, (err, result) => {
        if (result.dbs_created === 1) {
          console.log(`Database created: ${JSON.stringify(result, null, 2)}`);
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(`Database already exists: ${databaseName}`);
        }
      });

    r.db(databaseName).tableList().run(conn, (err, result) => {
      if (result.includes(tableName)) {
        console.log(`Table name already exists; ${tableName}`);
      } else {
        r.db(databaseName).tableCreate(tableName).run(conn, function (err, result) {
          console.log(`Table created: ${tableName}`);
          console.log(JSON.stringify(result, null, 2));
        });
      };
    });
  };

  generateO('membership', 'users');
  generateO('membership', 'users1');
  generateO('membership', 'logs');
  generateO('membership', 'sessions');

    // r.db('membership3').tableList().contains('hello').do(
    //   r.branch(
    //     r.row,
    //       table,
    //       r.do(function(){
    //           return r.db('membership3').tableCreate('hello', tableOptions).do(function () {
    //           return table;
    //           });
    //         }
    // ))).run(conn, function (err, result) {
    //   console.log(result);
    // });

    // var array = ['hello', 'plusser', 'froggy'];
    //
    // for (var i = 0; i < array.length; i++) {
    //   r.db('membership3').tableCreate(array[i]).run(conn, function (err, result) {
    //     // console.log(JSON.stringify(result, null, 2));
    //   });
    // };


  // create a table inside membership database
  // r.db('membership').tableCreate('tester123').run(conn, function (err, result) {
  //   if (err) {
  //     console.log('Table already exists bro');
  //   }
  //
  //   console.log(JSON.stringify(result, null, 2));
  // });

  // create database table
  // r.db('membership').table('users').insert([
  //   { name: 'Star Trek TNG', episodes: 178 },
  //   { name: 'Batasdsadtlestar Galactica', episodes: 75 },
  //   ]).run(conn, function (err, result) {
  //     if (err) throw err;
  //     console.log(JSON.stringify(result, null, 2));
  //   });

  // get all fields within the users table
  // r.db('membership').table('users').run(conn, function (err, cursor) {
  //   if (err) throw err;
  //
  //   cursor.toArray(function (err, result) {
  //     if (err) throw err;
  //     console.log(JSON.stringify(result, null, 2));
  //   });
  // });

});
