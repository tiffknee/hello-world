var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn; //cache spawn method on child_process
var proc; //global proc variable that we store the spawned process


app.use('/', express.static(path.join(__dirname, 'stream'))); //stream folder = static folder

app.get('/', function(req, res) { //default route to dispatch the index.html
  res.sendFile(__dirname + '/index.html');
});


var sockets = {}; //global sockets object to store all the connected sockets


io.on('connection', function(socket) {
 
  sockets[socket.id] = socket; //when a client connects to the server, a new socket will be created, stored in the global variable
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() { //delete the disconnected client from the global object
    delete sockets[socket.id];
 
    // no more clients, kill the stream (save power)
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 
  socket.on('start-stream', function() {
    startStreaming(io);
  });
 
});

///////// */ --------- START SERVER ---------  */

http.listen(3000, function() {
  console.log('listening on *:3000');
});
 
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}
 
function startStreaming(io) {
 
  if (app.get('watchingFile')) { //if capturing already started, do not re-init the same; emit the last saved image to the client
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000)); //avoid caching
    return;
  }
 
  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args); //if capturing not started, start a new child process and then spawn it with raspistill command; register a watch on the file which changes, whenever the file changes emit a URL to all the connected clients
 
  console.log('Watching for changes...');
 
  app.set('watchingFile', true);
 
  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
  })
 
}