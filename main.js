var http = require("http");

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  for (i=10;i>0;i--){
      response.write(String(i)+"<br />");
  }
  response.end('Boom!!!');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');
