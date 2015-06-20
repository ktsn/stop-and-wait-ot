import express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var buffer = new (require('./operations/operation-buffer'))();
var factory = new (require('./operations/operation-factory'))();
var maxSiteId = 0;

import path = require('path');

app.use(express.static(path.resolve(__dirname, '../www')));

io.on('connection', function(socket) {
  socket.emit('init', {
    siteId: ++maxSiteId,
    operations: buffer.getAll().map(serialize)
  });

  socket.on('operation', function(data) {
    var op = data.operation;
    buffer.append(factory.createFromObj(op), data.context, onAppend);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function onAppend(op) {
  io.emit('operation', op.parameters());
}

function serialize(op) {
  return op.parameters();
}
