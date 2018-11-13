var url = require('url');
var fs = require('fs');
var path = require('path');
var codein = require("node-codein");
var formidable = require("formidable");

var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

/*
app.get('/', function (req, res) {
  var indexPath = path.resolve('../public/index.html');
  console.log(indexPath);

  app.use(express.static('../public'));

});
*/

/*
app.get('/js/main.js', function (req, res) {
  var indexPath = path.resolve('../public/js/main.js');
  console.log(indexPath);
  res.sendfile(indexPath);
});
*/

/*
app.get('/css/style.css', function (req, res) {
  var indexPath = path.resolve('../public/css/style.css');
  console.log(indexPath);
  res.sendfile(indexPath);
});
*/

app.use('/',express.static('../public'));


app.get('/pair', pair);


/* app.get('/js/', express.static('../public/js')); */

/*
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/

/*
var app = connect()
  .use(connect.static('../static'))
  .use(function(req, res){
    handler(req, res);
  })
 .listen(8080);
console.log('app listening on localhost:8080');
console.log(io);
*/
 
//var index = fs.readFileSync('../index.html');
var pending = new Array();


function handler (req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  var pairRegex = new RegExp('^/pair/?$');
  var pairResponseRegex = new RegExp('^/pair/response/?$');
  var uploadRegex = new RegExp('^/upload/?$');
  var pathname = url.parse(req.url).pathname;

  if(pairRegex.test(pathname)){
    pair(req, res);
  }
  else if(pairResponseRegex.test(pathname)){
    pairResponse(req, res);
  }
  else if(uploadRegex.test(pathname)){
    upload(req, res);
  }
  else{
    render404(req, res);
  }

}


io.sockets.on('connection', function (socket) {

  console.log('socket connected');

  socket.emit('app', 'hello app');
  //socket.emit('viewer', 'hello viewer');

  socket.on('forViewer', function(data){
    //io.sockets.emit('viewer', data);
    test()
  });

  /*
  socket.on('forViewer', function(data){
    socket.emit('app', data);
  })
  */

  //socket.emit('app connected', { hello: 'world' });
  //socket.emit('file uploaded viewer', 'test 2');

  //socket.emit('new file uploaded', { file: 'new' });

});

function test(){
  io.sockets.emit('viewer', 'testing emit outside on');
}


function pair(req, res){
  var max = 9999;
  var min = 1000;
  var id = Math.floor(Math.random()*( max - min + 1)) + min;
  var o = {id: id};

  pending.push(o.id);
  //console.log(pending.toString());
  //fs.mkdir('../uploads/' + o.id.toString());

  res.writeHead(200, {'Content-type': 'application/json'});
	res.end(JSON.stringify(o));

}

function pairResponse(request, response){

  pending.push('1234');

  var form = new formidable.IncomingForm();
  var o = {id: null};
  var code;

  form.parse(request, function(err, fields, files) {
    code = fields.code;

    for (var i=0; i<pending.length; i++){
      console.log('--- pending ---');
      console.log(pending[i]);
      console.log(code);
      if(pending[i] == code){
        o.id = code;
        console.log(o.id);
        fs.mkdir('../uploads/' + o.id.toString());
      }
      
    }
    
    response.writeHead(200, {'Content-type': 'application/json'});
    //response.end(JSON.stringify(o));
    response.end(JSON.stringify(o));

  });

}

function upload(request, response){

    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files) {

      //console.log('field id:' + fields.id);
      //io.emit('new file uploaded', {file: 'new'});

      for(var file in files){
        var directory = 'uploads/' + fields.id + '/' + files[file].name;
        var newPath = '../' + directory;
        fs.rename(files[file].path, newPath, function(err){
          if (err) throw err;
          //console.log('renamed complete');

          files[file].path = directory;
          io.sockets.emit('viewer', 'test for emit in upload');

          io.sockets.emit('new file uploaded', {id: fields.id, file: files[file]});

          //console.log(fields.id);
          //console.log(files[file]);

        });
      }

      response.writeHead(200, {'content-type': 'text/plain'});
      response.write('received upload:\n\n');
      response.end(console.log({fields: fields, files: files}));
    });

}

function render404(req, res){

/*
  res.writeHead(200, {
		'Content-type': 'text/html; charset=utf-8'
	});
	res.end(index);
*/

  res.writeHead(404);
  res.end('404 File not found');
}

/*
fs.watch('../uploads/', function (event, filename) {
  console.log('event is: ' + event);

  io.sockets.emit('news', { hello: 'world 2' });

  io.sockets.emit('file uploaded', {file: 'uploaded'});


  if (filename) {
    console.log('filename provided: ' + filename);
  } else {
    console.log('filename not provided');
  }
});
*/

