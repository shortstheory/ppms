var mysql = require('mysql');

var sqlquery = module.exports = {
    runQuery: function (connection, queryString, callback, res) {
        connection.query(queryString, function(err, rows, fields) {
                console.log(queryString);
                callback(rows, res);
        }
    )},
    runCommitQuery: function (connection, queryString, callback, res) {
        connection.query(queryString, function(err, rows, fields) {
                console.log(queryString);
                callback(rows, res);
        });
        connection.commit(function(err) {
            if (err)
                return connection.rollback(function() {
                    throw err;
              });
          });
    }
};
