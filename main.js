var query = require('./query.js')
var sqlquery = require('./sqlquery.js')

var http = require('http');
var mysql = require('mysql');
var express = require('express')
var json2html = require('node-json2html')
var fs = require('fs')
var path = require('path')
var tableify = require('tableify');
var jsdom = require('jsdom');

app = express();

var myconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'ppms'
});

myconnection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
    } else {
        console.log('Connected to database.');
    }
});

function vaccineTableTransform(rows) {
    var transform = {
        tag: 'tr',
        children: [{
            'tag': 'td',
            'html': '${NAME}'
        },{
            'tag': 'td',
            'html': '${PRICE}'
        },{
            'tag': 'td',
            'html': '${STOCK}'
        },{
            'tag': 'td',
            'html': '<div class="btn-group"><a class="btn btn-danger" href="vaccineResult?deleteValue=${NAME}"><i class="icon_close_alt2"></i></a></div>'
        }]
    };
    var html = json2html.transform(rows, transform);
    var tableHeader = '<tr><th>NAME</th><th>PRICE</th><th>STOCK</th><th>DELETE</th></tr>';
    html = tableHeader + html;
    return html;
}

function patientTableTransform(rows) {
    var transform = {
        tag: 'tr',
        children: [{
            'tag': 'td',
            'html': '${ID}'
        },{
            'tag': 'td',
            'html': '${NAME}'
        },{
            'tag': 'td',
            'html': '${DOB}'
        },{
            'tag': 'td',
            'html': '${MOBILE}'
        },{
            'tag': 'td',
            'html': '${ADDRESS}'
        },{
            'tag': 'td',
            'html': '<div class="btn-group"><a class="btn btn-primary" href="editPatient?patientId=${ID}"><i class="icon_plus_alt2"></i></a><a class="btn btn-success" href="patientManagment?patientId=${ID}"><i class="icon_check_alt2"></i></a><a class="btn btn-danger" href="patientResult?deletePatientId=${ID}"><i class="icon_close_alt2"></i></a></div>'
        }]
    };
    var html = json2html.transform(rows, transform);
    var tableHeader = '<tr><th>ID</th><th>NAME</th><th>DOB</th><th>MOBILE</th><th>ADDRESS</th></tr>'; //<tr><th>ACTION</th></tr>';
    html = tableHeader + html;
    return html;
}

var vaccineResultCallback = function(rows, res) {
    var tableHtml = vaccineTableTransform(rows);//tableify(rows);
    fs.readFile(path.join(__dirname+'/PPMS_GUI/vaccine_result.html'), 'utf-8', function(err, html) {
        jsdom.env(html,null, function(err, window) {
            var $ = require('jquery')(window);
            $("#vaccineTable").html(tableHtml);
            res.send('<html>'+$("html").html()+'</html>');
        });
    });
}

var patientResultCallback = function(rows, res) {
    console.log(rows);
    var tableHtml = patientTableTransform(rows);//tableify(rows);
    fs.readFile(path.join(__dirname+'/PPMS_GUI/patient_result.html'), 'utf-8', function(err, html) {
        jsdom.env(html,null, function(err, window) {
            var $ = require('jquery')(window);
            $("#patientTable").html(tableHtml);
            res.send('<html>'+$("html").html()+'</html>');
        });
    });
}

var patientEditCallback = function(rows, res) {
    console.log(rows[0].MOBILE);
    fs.readFile(path.join(__dirname+'/PPMS_GUI/patient_editPatient.html'), 'utf-8', function(err, html) {
        jsdom.env(html,null, function(err, window) {
            var $ = require('jquery')(window);
            $("#patientName").attr("value", rows[0].NAME);
            $("#dateOfBirth").attr("value", rows[0].DOB);
            $("#mobileNo").attr("value", "" + rows[0].MOBILE + "");
            $("#address").html(rows[0].ADDRESS);
            console.log('<html>'+$("html").html()+'</html>');
            res.send('<html>'+$("html").html()+'</html>');
        });
    });

}

var resultCallback = function(rows, res) {
    if (typeof rows == 'undefined') {
        res.send('Nothing to display');
        return;
    }
    console.log(rows);
    var html = tableify(rows);
    console.log(html);
    res.send(html);
};

var insertCallback = function(rows, res){
    if (typeof rows == 'undefined') {
        res.send('Nothing to display');
        return;
    }
    var alertScript = '<script type = text/javascript>alert("Done");</script>';
    res.sendFile(path.join(__dirname+'/PPMS_GUI/index.html'))
};

app.use(express.static(__dirname + '/PPMS_GUI'));

app.get('/index', function(req, res){
    console.log('Fetching today\'s patients');
    sqlquery.runQuery(myconnection,'SELECT P.NAME, P.MOBILE, P.ADDRESS FROM PATIENT P, P_VISITS_D PD WHERE P.ID = PD.PID AND PD.VISIT_DATE=DATE(SYSDATE())' , resultCallback, res);
});

var q;
app.get('/patientResult', function(req, res) {
    if (typeof req.query.type !== 'undefined')
    {
      q = req.query;
      var type = req.query.type;
      if (type == 'name') {
          sqlquery.runQuery(myconnection, 'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT WHERE NAME LIKE "%' + req.query.pname + '%"', patientResultCallback, res);
      } else if (type == 'mobile') {
          sqlquery.runQuery(myconnection,'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT WHERE MOBILE=' + req.query.mobileNo, patientResultCallback, res);
      } else if (type == 'date') {
          var date = req.query.year+'-'+req.query.month+'-'+req.query.day;
          sqlquery.runQuery(myconnection,'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT P, P_VISITS_D V WHERE P.ID = V.PID AND V.VISIT_DATE="' + date + '"', patientResultCallback, res);
      }
    }
    else if (typeof req.query.deletePatientId !== 'undefined')
    {
      sqlquery.runCommitQuery(myconnection, 'DELETE FROM PATIENT WHERE ID=' + req.query.deletePatientId, function(rows, res){console.log(rows);}, res);
      var type = q.type;
      if (type == 'name') {
          sqlquery.runQuery(myconnection, 'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT WHERE NAME LIKE "%' + q.pname + '%"', patientResultCallback, res);
      } else if (type == 'mobile') {
          sqlquery.runQuery(myconnection,'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT WHERE MOBILE=' + q.mobileNo, patientResultCallback, res);
      } else if (type == 'date') {
          var date = q.year+'-'+q.month+'-'+q.day;
          sqlquery.runQuery(myconnection,'SELECT ID, NAME, DOB, MOBILE, ADDRESS FROM PATIENT P, P_VISITS_D V WHERE P.ID = V.PID AND V.VISIT_DATE="' + date + '"', patientResultCallback, res);
      }
    }
});

app.get('/vaccine_addVaccine', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO VACCINE (NAME, PRICE) VALUES("' + req.query.vaccineName +'", ' + req.query.vaccinePrice + ')' ,insertCallback, res);
});

app.get('/patient_newPatientRecord', function(req, res) {
    sqlquery.runCommitQuery(myconnection,'INSERT INTO PATIENT (NAME, DOB, MOBILE, ADDRESS) VALUES("' + req.query.patientName + '", "' + req.query.dateOfBirth + '", "' + req.query.mobileNo + '", "' + req.query.address + '")' , insertCallback, res);
});

app.get('/editPatient', function(req, res) {
    sqlquery.runQuery(myconnection, 'SELECT NAME, DOB, MOBILE, ADDRESS FROM PATIENT WHERE ID=' + req.query.patientId, patientEditCallback, res);
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

var lastVaccineQuery;
app.get('/vaccineResult', function(req, res) {
    if (typeof req.query.searchVaccine !== 'undefined') {
        lastVaccineQuery = req.query.searchVaccine;
        sqlquery.runQuery(myconnection, 'SELECT NAME, PRICE, STOCK FROM VACCINE WHERE NAME LIKE "%' + req.query.searchVaccine + '%"', vaccineResultCallback, res);
    } else if (typeof req.query.deleteValue !== 'undefined') {
        sqlquery.runCommitQuery(myconnection, 'DELETE FROM VACCINE WHERE NAME="' + req.query.deleteValue + '"', function(rows, res){console.log(rows)}, res);
        sqlquery.runQuery(myconnection, 'SELECT NAME, PRICE, STOCK FROM VACCINE WHERE NAME LIKE "%' + lastVaccineQuery + '%"', vaccineResultCallback, res);
    }
});

http.createServer(function(req, res){
});

app.listen(8081, function() {
    console.log('on8081');
});

var html = fs.readFileSync(path.join(__dirname+'/PPMS_GUI/vaccine_result.html'), 'utf-8');

console.log('Server running at http://127.0.0.1:8081/');
