//Config
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , url = require('url')
  , fs = require('fs')
  , path = require('path')
  , codein = require('node-codein')
  , formidable = require('formidable');

//Routes
app.get('/pair', pair);
app.post('/pair/submit', userSubmittedCode);
app.post('/upload', upload);

app.use('/',express.static('../public'));
app.use('/uploads',express.static('../uploads'));
app.use(function(req,res,next){
  res.send(404, '404 File not found');
})

//Server
server.listen(8080);

/*
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/
 
//var index = fs.readFileSync('../index.html');
var newPairCodes = new Array();


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

  newPairCodes.push(o.id);
  //console.log(newPairCodes.toString());
  //fs.mkdir('../uploads/' + o.id.toString());

  res.writeHead(200, {'Content-type': 'application/json'});
	res.end(JSON.stringify(o));

}

function userSubmittedCode(request, response){

  //newPairCodes.push('1234');

  var form = new formidable.IncomingForm();
  var o = {id: null};

  form.parse(request, function(err, fields, files) {
    var codeEnteredByUser = fields.code;
    var currentCode;
    
    for (var i=0; i < newPairCodes.length; i++){
      currentCode = newPairCodes[i];
      if(currentCode == codeEnteredByUser){
        o.id = codeEnteredByUser;
        fs.mkdir('../uploads/' + o.id.toString());
        io.sockets.emit('app', { event: 'PAIR_SUCCESSFUL', data: {id: o.id} });
        newPairCodes.pop(currentCode);
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
          io.sockets.emit('viewer', { event: 'NEW_FILE_UPLOADED', data: {url: directory} });

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

