var http = require('http');

console.log('Creating a simple HTTP request');

http.get("http://api.ipify.org?format=json", function(res) {
  var body = ''; // Will contain the final response
  // Received data is a buffer.
  // Adding it to our body
  res.on('data', function(data){
    body += data;
  });
  // After the response is completed, parse it and log it to the console
  res.on('end', function() {
    var parsed = JSON.parse(body);
    console.log(parsed);
  });
})
// If any error has occured, log error to console
.on('error', function(e) {
  console.log("Got error: " + e.message);
}); 
