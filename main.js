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
    if (typeof rows == 'undefined')
    {
        res.send('Nothing to display');
        return;
    }
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
    res.send(html); */
};

var insertCallback = function(rows, res){
  if (typeof rows == 'undefined')
  {
      res.send('Nothing to display');
  }
  var alertScript = '<script type = text/javascript>alert("Done");</script>';
  // res.send(alertScript);
  res.sendFile(path.join(__dirname+'/PPMS_GUI/index.html'))
};

app.use(express.static(__dirname + '/PPMS_GUI'));

app.get('/vaccineResult', function(req, res) {
    sqlquery.runQuery(myconnection, 'SELECT NAME, PRICE, STOCK FROM VACCINE WHERE NAME LIKE "%' + req.query.searchVaccine + '%"' ,resultCallback, res);
});

app.get('/patientResult', function(req, res) {
    var type = req.query.type;
    if(type == 'name')
        sqlquery.runQuery(myconnection, 'SELECT * FROM PATIENT WHERE NAME LIKE "%' + req.query.pname + '%"', resultCallback, res);
    else if(type == 'mobile')
        sqlquery.runQuery(myconnection,'SELECT * FROM PATIENT WHERE MOBILE=' + req.query.mobileNo, resultCallback, res);
    else if(type == 'date')
        sqlquery.runQuery(myconnection,'SELECT * FROM PATIENT P, P_VISITS_D V WHERE P.ID = V.PID AND V.VISIT_DATE=' + req.query.dateOfPreviousVisit, resultCallback, res);
});

app.get('/vaccine_addVaccine', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO VACCINE (NAME, PRICE) VALUES("' + req.query.vaccineName +'", ' + req.query.vaccinePrice + ')' ,insertCallback, res);
});

app.get('/patient_newPatientRecord', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO PATIENT (NAME, DOB, MOBILE, ADDRESS) VALUES("' + req.query.patientName + '", "' + req.query.dateOfBirth + '", "' + req.query.mobileNo + '", "' + req.query.address + '")' , insertCallback, res);
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
    res.sendFile(path.join(__dirname+'/PPMS_GUI/index.html'));
});

http.createServer(function(req, res){
});

app.listen(8081, function() {
    console.log('on8081');
});

console.log('Server running at http://127.0.0.1:8081/');
