var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require("/usr/local/Cellar/node/0.8.18/lib/node_modules/npm/node_modules/socket.io").listen(app);

var codein = require("/usr/local/Cellar/node/0.8.18/lib/node_modules/npm/node_modules/node-codein");
var formidable = require("/usr/local/Cellar/node/0.8.18/lib/node_modules/npm/node_modules/formidable");


var index = fs.readFileSync('../index.html');
var pending = new Array();


app.listen(8000);
console.log('app listening on localhost:8000');


function handler (req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  var returnIdRegex = new RegExp('^/new/?$');
  var uploadRegex = new RegExp('^/upload/?$');

  var pathname = url.parse(req.url).pathname;
  if(returnIdRegex.test(pathname)){
    newDevice(req, res);
  } else if(uploadRegex.test(pathname))
    upload(req, res);
  else{
    //render404(request,response);

  res.writeHead(200, {
		'Content-type': 'text/html; charset=utf-8'
	});
	res.end(index);

  }

  /*
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
  */

}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


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


function newDevice(request, response){
  var max = 9999;
  var min = 1000;
  var id = Math.floor(Math.random()*( max - min + 1)) + min;
  var o = {id: id};

  pending.push(o.id);
  console.log(pending.toString());
  fs.mkdir('../uploads/' + o.id.toString());


  response.writeHead(200, {
		'Content-type': 'application/json'
	});
	response.end(JSON.stringify(o));

}

function upload(request, response){

    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(request, function(err, fields, files) {

      //console.log('file...')
      //console.log(files[0]);

      console.log('field id:' + fields.id);

      for(var file in files){
        fs.rename(files[file].path, '../uploads/' + fields.id + '/' + files[file].name, function(err){
          if (err) throw err;
          console.log('renamed complete');

          io.emit('file uploaded', {file: 'uploaded'});

        });
      }

      /*

      for(var file in files){
        console.log(file);
        fs.rename(file.path, '../uploads/' + file.name, function(err){
          if (err) throw err;
          console.log('renamed complete');
        })
      }
*/


      response.writeHead(200, {'content-type': 'text/plain'});
      response.write('received upload:\n\n');
      response.end(console.log({fields: fields, files: files}));
    });


  //console.log('uploading...');
  //console.log(request);
}

function render404(request, response){
  response.writeHead(404);
  response.end('404 File not found');
}

