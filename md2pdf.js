var json2html = require('node-json2html')
var fs = require('fs')
var tableify = require('tableify');
var jsdom = require('jsdom');

var src = './bill.html'
// Arguments in either a single String or as an Array:
var args = '-s -o md.pdf';

var html2pdf = module.exports = {
    makePdf = function (doctorName, visitDate, diagnosis, treatment, billtable) {
        
    }
};

// Set your callback function
callback = function (err, result) {
  if (err) console.error('Oh Nos: ',err);
  // Without the -o arg, the converted value will be returned.
  return console.log(result), result;
};

// Call pandoc
pandoc(src, args, callback);
