var http = require('http');
var mysql = require('mysql');
var sqlquery = require('./sqlquery.js')
var query = require('./query.js')
var express = require('express')
var json2html = require('node-json2html')
var fs = require('fs')
var path = require('path')

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

var resultCallback = function(rows, res) {
    console.log(rows);
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
    html = '<table id = "markstable">' + tableHeader + html + '</table>'
    res.send(html);
}

app.use(express.static(__dirname + '/PPMS_GUI'));

app.get('/result', function(req, res) { //include page from which request is coming in GET
    sqlquery.runQuery(myconnection, 'select * from mytable where exam=\'' + req.query.exam +'\'', resultCallback, res);
});

app.get('/about',function(req,res){
    res.sendFile(path.join(__dirname+'/my.html'));
});

app.get('/', function(req, res) {
    query.selectQuery(myconnection, 'mytable', resultCallback, res);
});

app.get('/index', function(req, res) {
    res.sendFile(path.join(__dirname+'/PPMS_GUI/index.html'))
})

http.createServer(function(req, res){
});

app.listen(8081, function() {
    console.log('on8081');
});

console.log('Server running at http://127.0.0.1:8081/');
