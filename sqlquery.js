var mysql = require('mysql');

var sqlquery = module.exports = {
    runQuery: function (connection, queryString, callback, res) {
        connection.query(queryString, function(err, rows, fields) {
                console.log(queryString);
                callback(rows, res);
        }
    )}
};
