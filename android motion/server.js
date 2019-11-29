var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url = require('url');
//serving webpages
// var http = require('http');
var express = require('express');
var app = express();

var options = {
  key: fs.readFileSync('localhost+2-key.pem'),
  cert: fs.readFileSync('localhost+2.pem')
  // key: fs.readFileSync('./localhost.key'),
  // cert: fs.readFileSync('./localhost.cert'),
  // requestCert: false,
  // rejectUnauthorized: false
};

function handleIt(req, res) {
  var parsedUrl = url.parse(req.url);

  var path = parsedUrl.pathname;
  console.log("path: " + path)
  if (path == "/") {
    path = "index.html";
  }

  fs.readFile(__dirname + path,

    // Callback function for reading
    function (err, fileContents) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + req.url);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(fileContents);
    }
  );

  // Send a log message to the console
  console.log("Got a request " + req.url);
}

app.get("*", (req, res) => {
  console.log(req.headers.host + req.path)
  res.sendFile(__dirname + req.path);
});

// app.listen(8000, () => {
//   console.log(`Server listening at ${8000}`);
// });

var httpsServer = https.createServer(options, app);
httpsServer.listen(8081);

console.log('Server listening on port 8081');

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpsServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);


    socket.on('orientdata', function (alpha, beta, gamma) {
      io.sockets.emit('orientdata', alpha, beta, gamma);
      // console.log(beta);
    });

    socket.on('motiondata', function (x, y, z) {
      io.sockets.emit('motiondata', x, y, z);
      // console.log(beta);
    });

    socket.on('disconnect', function () {
      // check if id closed window, if yes, delete from array
      console.log("Client has disconnected: " + socket.id);
    });
  }
);
