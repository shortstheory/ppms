var json2html = require('node-json2html')
var fs = require('fs')
var tableify = require('tableify');
var jsdom = require('jsdom');
var pandoc = require('node-pandoc');
var src = './bill.html'
// Arguments in either a single String or as an Array:
var args = '-s -o md.pdf';

var html2pdf = module.exports = {
    makePdf: function (doctorName, patientName, visitDate, diagnosis, treatment, billtable) {
        var args = '-f html -s -o my2pdf.pdf'
        // var buf = fs.readFile('./bill.html', 'utf8');
        fs.readFile('./bill.html', 'utf-8', function(err, html) {
            jsdom.env(html,null, function(err, window) {
                var $ = require('jquery')(window);
                $("#doctor").html('Doctor: ' + doctorName);
                $("#patient").html('Patient: ' + patientName);
                $("#visitdate").html('Date of Visit: ' + visitDate);
                $("#diagnosis").html('Diagnosis: ' + diagnosis);
                $("#treatment").html('Treatment: ' + treatment);
                $("#billtable").html(tableify(billtable));
                html = '<html>'+$("html").html()+'</html>';
                pandoc(html, args, function(err, result){});
            });
        });
    }
};

html2pdf.makePdf('Dr Das', 'Kalpana', '18-05-2015', 'Dengue', 'Drink water', 'tbd')
