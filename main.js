var http = require("http");
var mysql = require('mysql');
var query = require('./query.js')
var express = require('express')
var json2html = require('node-json2html')
app = express();

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
    app.get('/', function(req, res) {
        var transform = {
            tag: 'tr',
            children: [{
                    'tag': 'td',
                    'html': '${exam}'
                }, {
                    'tag': 'td',
                    'html': '${marks}'
            }]
        };
        var html = json2html.transform(rows, transform);
        var tableHeader = '<tr><td>exam</td><td>marks</td></tr>'
        html = '<table>' + tableHeader + html + '</table>'
        res.send(html);
        console.log(html);
    })
}
//)


query.selectQuery(myconnection, 'mytable', myCallback,['*']);

http.createServer(function(req,res){});
app.listen(8081, function(){
    console.log('on8081');
});
console.log('Server running at http://127.0.0.1:8081/');
