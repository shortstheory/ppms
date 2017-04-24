var json2html = require('node-json2html')
var fs = require('fs')
var tableify = require('tableify');
var jsdom = require('jsdom');
var pandoc = require('node-pandoc');
var json2csv = require('json2csv');
var jsonexport = require('jsonexport');
// Arguments in either a single String or as an Array:

var html2pdf = module.exports = {
    makeBillPdf: function (doctorName, patientName, visitDate, diagnosis, treatment, email, previous, consultation, vaccine, operation, total) {
        var args = '-f html -s -o bill.pdf';
        console.log(doctorName + patientName + visitDate + diagnosis + treatment);
        fs.readFile('./bill.html', 'utf-8', function(err, html) {
            jsdom.env(html,null, function(err, window) {
                var $ = require('jquery')(window);
                $("#doctor").html('DOCTOR: ' + doctorName);
                $("#patient").html('PATIENT: ' + patientName);
                $("#visitdate").html('DATE OF VISIT: ' + visitDate);
                $("#diagnosis").html('DIAGNOSIS: ' + diagnosis);
                $("#treatment").html('TREATMENT: ' + treatment);
                $("#email").html('EMAIL: ' + email);
                $("#vaccine").html('VACCINE: ' + vaccine);
                $("#operation").html('OPERATION: ' + operation);
                $("#previousDues").html('PREVIOUS DUES: ' + previous);
                $("#consultation").html('CONSULTATION: ' + consultation);
                $("#total").html('TOTAL: ' + total);
//                $("#billtable").html(tableify(billtable));
                html = '<html>'+$("html").html()+'</html>';
                console.log(html);
                pandoc(html, args, function(err, result){console.log('doneGenerating');});
            });
        });
    },
    makeVaccineCSV: function(vaccineJSON) {
        var result = jsonexport(vaccineJSON, function(err, csv) {
            fs.writeFile('./vaccines.csv', csv, function(err) {
                if (err) {
                    return console.log("error");
                }
                console.log('File created');
            });
        });
    },
    makeWeekReportCSV: function(weekJSON) {
        var result = jsonexport(weekJSON, function(err, csv) {
            fs.writeFile('./week-report.csv', csv, function(err) {
                if (err) {
                    return console.log("error");
                }
                console.log('File created');
            });
        });
    }
};

//html2pdf.makePdf('Dr Das', 'ASD', '18-05-2015', 'Dengue', 'Drink water', 'tbd')
