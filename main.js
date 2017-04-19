var query = require('./query.js')
var sqlquery = require('./sqlquery.js')

var http = require('http');
var mysql = require('mysql');
var express = require('express')
var json2html = require('node-json2html')
var fs = require('fs')
var path = require('path')
var tableify = require('tableify');

app = express();

var myconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'ppms'
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
    var html = tableify(rows);
    console.log(html);
    res.send(html);
/*    var transform = {
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
    res.send(html);*/
}

app.use(express.static(__dirname + '/PPMS_GUI'));

app.get('/vaccineResult', function(req, res) {
    sqlquery.runQuery(myconnection, 'SELECT NAME, PRICE, STOCK FROM VACCINE WHERE NAME LIKE "%' + req.query.searchVaccine + '%"' ,resultCallback, res);
});

app.get('/patientResult', function(req, res) {
    var type = res.query.type;
    if(type == 'name')
        sqlquery.runQuery(myconnection, 'SELECT * FROM PATIENT WHERE NAME LIKE "%' + res.query.pname + '%"', resultCallback, res);
    else if(type == 'mobile')
        sqlquery.runQuery(myconnection,'SELECT * FROM PATIENT WHERE MOBILE=' + req.query.mobileNo, resultCallback, res);
    else if(type == 'date')
        sqlquery.runQuery(myconnection,'SELECT * FROM PATIENT P, P_VISITS_D V WHERE P.ID = V.PID AND V.VISIT_DATE=' + req.query.dateOfPreviousVisit, resultCallback, res);
});

app.get('/vaccine_addVaccine.html', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO VACCINE (NAME, PRICE) VALUES(' + req.query.vaccineName +', ' + req.query.vaccinePrice + ')' ,resultCallback, res);
});

app.get('/patient_newPatientRecord.html', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO PATIENT (NAME, DOB, MOBILE, ADDRESS) VALUES(' + req.query.patientName + ', ' + req.query.dateOfBirth + ', ' + req.query.mobileNo + ', ' + req.query.address + ');' , resultCallback, res);
});


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
