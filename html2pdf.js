var json2html = require('node-json2html')
var fs = require('fs')
var tableify = require('tableify');
var jsdom = require('jsdom');
var pandoc = require('node-pandoc');
// Arguments in either a single String or as an Array:

var html2pdf = module.exports = {
    makeBillPdf: function (doctorName, patientName, visitDate, diagnosis, treatment, email, previous, consultation, vaccine, operation, total) {
        var args = '-f html -s -o bill.pdf';
        console.log(doctorName + patientName + visitDate + diagnosis + treatment);
        fs.readFile('./bill.html', 'utf-8', function(err, html) {
            jsdom.env(html,null, function(err, window) {
                var $ = require('jquery')(window);
                $("#doctor").html('Doctor: ' + doctorName);
                $("#patient").html('Patient: ' + patientName);
                $("#visitdate").html('Date of Visit: ' + visitDate);
                $("#diagnosis").html('Diagnosis: ' + diagnosis);
                $("#treatment").html('Treatment: ' + treatment);
                $("#email").html('Email: ' + email);
                $("#vaccine").html('Vaccine: ' + vaccine);
                $("#operation").html('Operation: ' + operation);
                $("#previousDues").html('Previous Dues: ' + previousDues);
                $("#consultation").html('Consultation: ' + consultation);
                $("#total").html('Total: ' + total);
//                $("#billtable").html(tableify(billtable));
                html = '<html>'+$("html").html()+'</html>';
                console.log(html);
                pandoc(html, args, function(err, result){console.log('doneGenerating');});
            });
        });
    }
};

//html2pdf.makePdf('Dr Das', 'ASD', '18-05-2015', 'Dengue', 'Drink water', 'tbd')
