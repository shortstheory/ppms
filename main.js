var crypto = require('crypto');
var query = require('./query.js')
var sqlquery = require('./sqlquery.js')
var password = require('./password.js')
var http = require('http');
var mysql = require('mysql');
var express = require('express')
var json2html = require('node-json2html')
var fs = require('fs')
var path = require('path')
var tableify = require('tableify');
var jsdom = require('jsdom');

var bodyParser = require('body-parser')

app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var openPatientId;
var openDoctorId = 1;

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
            'html': '<div class="btn-group"><a class="btn btn-primary" href="editPatient?patientId=${ID}"><i class="icon_plus_alt2"></i></a><a class="btn btn-success" href="patientManagement?patientId=${ID}"><i class="icon_check_alt2"></i></a><a class="btn btn-danger" href="patientResult?deletePatientId=${ID}"><i class="icon_close_alt2"></i></a></div>'
        }]
    };
    var html = json2html.transform(rows, transform);
    var tableHeader = '<tr><th>ID</th><th>NAME</th><th>DOB</th><th>MOBILE</th><th>ADDRESS</th></tr>'; //<tr><th>ACTION</th></tr>';
    html = tableHeader + html;
    return html;
}

function historyTableTransform(rows) {
    var transform = {
        tag : 'tr',
        children : [{
            'tag' : 'td',
            'html' : '${VISIT_ID}'
        },{
            'tag' : 'td',
            'html' : '${DIAGNOSIS}'
        },{
            'tag' : 'td',
            'html' : '${TREATMENT}'
        },{
            'tag' : 'td',
            'html' : '${VACCINE_NAME}'
        }]
    };
    var html = json2html.transform(rows, transform);
    var tableHeader = '<tr><th>Visit ID</th><th>Diagnosis</th><th>Treatment</th><th>Vaccine</th></tr>';
    html = tableHeader + html;
    console.log(html)
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
    fs.readFile(path.join(__dirname+'/PPMS_GUI/patient_editPatient.html'), 'utf-8', function(err, html) {
        jsdom.env(html,null, function(err, window) {
            var $ = require('jquery')(window);
            $("#patientName").attr("value", rows[0].NAME);
            $("#dateOfBirth").attr("value", rows[0].DOB);
            $("#mobileNo").attr("value", "" + rows[0].MOBILE + "");
            $("#address").html(rows[0].ADDRESS);
            res.send('<html>'+$("html").html()+'</html>');
        });
    });
}

var patientManagementCallback = function(rows, res) {
  fs.readFile(path.join(__dirname+'/PPMS_GUI/patient_currentVisit.html'), 'utf-8', function(err, html) {
      jsdom.env(html,null, function(err, window) {
          var $ = require('jquery')(window);
          $("#patientName").html(rows[0].NAME);
          $("#dateOfBirth").html(rows[0].DOB);
          $("#mobileNo").html(rows[0].MOBILE);

          var transform = {
              tag : '',
              children : [{
              'tag' : 'option',
              'html' : '${NAME}'
            }]
          };
          rows.shift(); // Remove patient details from rows
          var html = '<option selected> None </option>' + json2html.transform(rows, transform);
          $("#vaccines").html(html);
          // console.log($("#patientName").val());
          // console.log(html);
          res.send('<html>'+$("html").html()+'</html>');
      });
  });
};

var historyCallback = function(rows, res) {
  console.log(rows);
  var tableHtml = historyTableTransform(rows);//tableify(rows);
  fs.readFile(path.join(__dirname+'/PPMS_GUI/patient_previousHistory.html'), 'utf-8', function(err, html) {
      jsdom.env(html,null, function(err, window) {
          var $ = require('jquery')(window);
          $("#previousHistoryTable").html(tableHtml);
          res.send('<html>'+$("html").html()+'</html>');
      });
  });
};

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
    //console.log('Fetching today\'s patients');
    //sqlquery.runQuery(myconnection,'SELECT P.NAME, P.MOBILE, P.ADDRESS FROM PATIENT P, P_VISITS_D PD WHERE P.ID = PD.PID AND PD.VISIT_DATE=DATE(SYSDATE())' , resultCallback, res);
    //console.log(req.query);
    // if (typeof req.query.type !== 'undefined') {
    //     console.log('execrCQ');
         sqlquery.runCommitQuery(myconnection, 'UPDATE PATIENT SET NAME="' + req.query.patientName + '", DOB="' + req.query.dateOfBirth + '", MOBILE=' + req.query.mobileNo + ', ADDRESS="' + req.query.address + '" WHERE ID=' + openPatientId, function(){}, res);
    // }
});

app.get('/patient_previousHistory', function(req, res) {
    sqlquery.runQuery(myconnection, 'select PVD.VISIT_ID, PVD.DIAGNOSIS, PVD.TREATMENT, V.NAME AS VACCINE_NAME FROM P_VISITS_D PVD, P_TAKES_V PTV, VACCINE V WHERE PVD.VISIT_ID=PTV.VISIT_ID AND PTV.VID=V.ID AND PVD.PID=' + openPatientId + ' UNION SELECT VISIT_ID, DIAGNOSIS, TREATMENT, "None" AS VACCINE_NAME FROM P_VISITS_D WHERE PID=' + openPatientId, historyCallback, res);
});

var billingCallback = function(rows, res) {
    fs.readFile(path.join(__dirname+'/PPMS_GUI/billing.html'), 'utf-8', function(err, html) {
        jsdom.env(html,null, function(err, window) {
            var $ = require('jquery')(window);
            if (typeof rows !== undefined) {
                $("#vaccine_cost").attr("value", rows[0].PRICE);
                console.log(rows[0].PRICE);
            }
            res.send('<html>'+$("html").html()+'</html>');
        });
    });
}

app.get('/billing', function(req, res) {
    var vaccine = req.query.vaccineName;
    if (vaccine !== 'None') {
        sqlquery.runCommitQuery(myconnection, 'INSERT INTO P_VISITS_D (PID, DID, VISIT_DATE, DIAGNOSIS, TREATMENT) VALUES (' + openPatientId + ', ' + openDoctorId + ' , DATE(SYSDATE()), "' + req.query.diagnosis + '", "' + req.query.treatment + '")', function(rows, res){console.log(rows);}, res);
        sqlquery.runCommitQuery(myconnection, 'INSERT INTO P_TAKES_V (PID, VID, VISIT_ID) VALUES (' + openPatientId + ', (SELECT ID FROM VACCINE WHERE NAME="' + vaccine + '"), (SELECT MAX(VISIT_ID) FROM P_VISITS_D))', function(rows, res){}, res);
        sqlquery.runQuery(myconnection, 'SELECT PRICE FROM VACCINE WHERE NAME="' + vaccine + '"', billingCallback, res);
    } else {// if (req.query.length == 4) {
        sqlquery.runCommitQuery(myconnection, 'INSERT INTO P_VISITS_D (PID, DID, VISIT_DATE, DIAGNOSIS, TREATMENT) VALUES (' + openPatientId + ', ' + openDoctorId + ' , DATE(SYSDATE()), "' + req.query.diagnosis + '", "' + req.query.treatment + '")', function(rows, res){console.log(rows)}, res);
        res.sendFile(path.join(__dirname+'/PPMS_GUI/billing.html'));
    }
});

var loginCallback = function(rows, res) {
    console.log(rows);
    if (typeof rows == 'undefined' || !password.checkPassword(pass, rows[0]["SALT"], rows[0]["PASSWORD"])) {
        fs.readFile(path.join(__dirname+'/PPMS_GUI/login.html'), 'utf-8', function(err, html) {
            jsdom.env(html,null, function(err, window) {
                var $ = require('jquery')(window);
                $("#wrongPassword").html('Wrong Password! Try again.');
                res.send('<html>'+$("html").html()+'</html>');
            });
        });
    } else {
        return res.redirect('/index.html');
    }
//    password.checkPassword(pass, rows["SALT"], rows["PASSWORD"]);
};

var name;
var pass;

app.post('/home', function(req, res){
    name = req.body.uname;
    pass = req.body.passw;

    sqlquery.runQuery(myconnection, 'SELECT PASSWORD, SALT FROM DOCTOR WHERE NAME="' + name + '"', loginCallback, res);
});

app.post('/signupsuccess', function(req, res) {
    var username = req.body.username;
    var pwd = req.body.password;
    var email = req.body.email;
    var mobileno = req.body.mobileno;
    password.createUser(myconnection, username, pwd, mobileno, email);
    res.redirect('/login.html');
});

app.get('/patientManagement', function(req, res) {
    openPatientId = req.query.patientId;
    sqlquery.runQuery(myconnection, 'SELECT ID, NAME, MOBILE, DOB FROM PATIENT WHERE ID=' + openPatientId + ' UNION SELECT * FROM VACCINE', patientManagementCallback,res);
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
    openPatientId = req.query.patientId;
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

//password.createUser(myconnection, 'asthana', 'iamlord', 7896543210);
//password.checkPassword('iamlord', '3302fdad74475bdb', '6f0c1fecc3d48d4a4ac7e5bfaafc1e937b0decc419eef450f64baa66e1311fbcc99a8ba0299e554fc9dbaf2b14f5b6f56dbcc18a6612a23cbc1f70f192e998e5');
