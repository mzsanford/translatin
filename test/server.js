var http = require('http');
var path = require('path');
var fs = require('fs');
var qs = require('querystring');

function logRequest(req, code) {
  console.log(req.method + " [" + code + "]: " + req.url);
}

http.createServer(function (request, response) {

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    if (request.method == "POST") {
      var body = '';
      request.on('data', function (data) {
          body += data;
      });
      request.on('end', function () {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end("OK", 'utf-8');
          logRequest(request, 200);
          console.log("  -- CONTENT: " + JSON.stringify(qs.parse(body)));
      });

      return;
    }

    path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                    logRequest(request, 500);
                } else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                    logRequest(request, 200);
                }
            });
        } else {
            response.writeHead(404);
            response.end();
            logRequest(request, 404);
        }
    });

}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');

