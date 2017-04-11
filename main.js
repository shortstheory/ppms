var mysql = require('mysql');

function selectQuery(connection, tableName, callback, selectParameters, whereParameters) {
    selectParameters = typeof selectParameters !== 'undefined' ? selectParameters : ['*'];
    selectParameters = selectParameters.join();
    if (typeof whereParameters == 'undefined') {
        connection.query('select ' + selectParameters + ' from ' + tableName, callback);
    } else {
        whereParameters = whereParameters.join();
        connection.query('select ' + selectParameters + ' from ' + tableName + ' where ' + whereParameters, callback);
    }
}

function deleteQuery(connection, tableName, callback, whereParameters) {
    if (typeof whereParameters == 'undefined') {
        console.log('This will delete all the data in the database!');
    } else {
        whereParameters = whereParameters.join();
        connection.query('delete from ' + tableName + ' where ' + whereParameters, callback);
    }
    connection.commit(function(err) {
        if (err)
            return connection.rollback(function() {
                throw err;
          });
        }
    )
}

function insertQuery(connection, tableName, callback, valueParameters, colParameters) {
    valueParameters = valueParameters.join();
    valueParameters = '(' + valueParameters + ')';
    if (typeof colParameters == 'undefined') {
        connection.query('insert into ' + tableName + ' values ' + valueParameters);
    } else {
        colParameters = colParameters.join();
        colParameters = '(' + colParameters + ')';
        connection.query('insert into ' + tableName + colParameters + ' values ' + valueParameters);
    }
    connection.commit(function(err) {
        if (err) {
            return connection.rollback(function() {
                throw err;
          });
        }
    })
}

function updateQuery(connection, tableName, callback, valueParameters, whereParameters) {
    valueParameters = valueParameters.join();
    if (typeof whereParameters == 'undefined') {
        connection.query('update ' + tableName + ' set ' + valueParameters);
    } else {
        whereParameters = whereParameters.join();
        connection.query('update ' + tableName + ' set ' + valueParameters + ' where ' + whereParameters);
    }
    connection.commit(function(err) {
        if (err) {
            return connection.rollback(function() {
                throw err;
          });
        }
    })
}

var myconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'tut'
});

myconnection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    } else {
        console.log('Connected to database.');
    }
});

var myCallback = function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.error(err.stack);
    return;
}

selectQuery(myconnection, 'mytable', myCallback,['*'],["exam='csf213'"]);
//deleteQuery(myconnection, 'mytable', function(){}, "exam='csf213'")
//insertQuery(myconnection, 'mytable', function(){}, [359,"'bitsat2'"]);
//updateQuery(myconnection, 'mytable', function(){}, ['marks = 170'], ['exam="csf215"']);
