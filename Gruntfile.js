var r = require('rethinkdb');
var assert = require('assert');

module.exports = (grunt) => {

  grunt.initConfig({
    jshint: {
      files: ['lib/**/*js', 'models/**/*js'],
    },
    watch: {
      files: ['lib/**/*js', 'models/**/*js'],
      tasks: ['jshint'],
    },
  });

  grunt.registerTask('installDb', function () {
      var done = this.async();
      r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {

        if (err) throw err;
        console.log('ji');
        // create membership if it doesnt exist
        var generateO = function () {
          // arguments = Array.prototype.slice.call(arguments);
          // var args = Array.from(arguments);
          // var args = [].slice.call(arguments);

          // check if array
          // if( Object.prototype.toString.call( someVar ) === '[object Array]' ) {
          //     alert( 'Array!' );
          // }

          // if( typeof someVar === 'string' ) {
          //     someVar = [ someVar ];
          // }

          // concat to an array
          // someVar = [].concat( someVar );

          var arguments = [...arguments];
          var dbName = arguments[0];
          console.log(arguments);
          r.dbList().contains(dbName)
            .do(function (databaseExists) {
              return r.branch(
                databaseExists,
                { dbs_created: 0 },
                r.dbCreate(dbName)
              );
            }).run(conn, function (err, result, done) {
              assert.ok(err === null, err);
              if (result.dbs_created === 1) {
                // if no database exists, message user
                console.log(`Database created: ${dbName}`);
              } else {
                // if database exists, message user
                console.log(`Database already exists: ${dbName}`);
              }
              done();
            });

            for (var i = 1; i < arguments.length; i++) {
              var table = arguments[i];

              (function (table) {
                  // rethinkdb + result returns an array
                  r.db(dbName).tableList().run(conn, function (err, result) {
                    assert.ok(err === null, err);

                    if (err) {
                      throw err;
                      return;
                    }

                    if (result.includes(table)) { // search the array with es6 includes
                      console.log(`Table name already exists: ${table}`);
                    } else {
                      r.db(dbName).tableCreate(table).run(conn, function (err, result) { // rethinkdb syntax
                        console.log(`Table created: ${table}`);
                        assert.ok(err === null, err);
                      });
                    };
                  });
                }(table)); // iife
            };
        };
        generateO('membership', 'users', 'logs', 'sessions');


      });

    });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
