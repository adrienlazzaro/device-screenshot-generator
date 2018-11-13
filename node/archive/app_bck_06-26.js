//var app = require('http').createServer(handler);
//var url = require('url');
//var fs = require('fs');
//var io = require("socket.io").listen(app);
//var codein = require("node-codein");
//var formidable = require("formidable");
//var connect = require("connect");

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8888);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '../static/index.html');
});

