$(function() {

	var useLocalHost = true;
	var serverRoot = (useLocalHost) ? 'localhost:8888/in_mobile_viewer/' : 'scream-ld.linkedin.biz/~alazzaro/in_mobile_viewer';
	//var serverRoot = (useLocalHost) ? 'alazzaro-mn.linkedin.biz:8888/in_mobile_viewer/' : 'scream-ld.linkedin.biz/~alazzaro/in_mobile_viewer';
	//var serverRoot = (useLocalHost) ? '172.16.44.111:8888/in_mobile_viewer/' : 'scream-ld.linkedin.biz/~alazzaro/in_mobile_viewer';
	var serverURL = 'http://' + serverRoot;

	var json;

	var QR = {

		create: function(text, typeNumber, errorCorrectLevel, table){
			var qr = qrcode(typeNumber || 5, errorCorrectLevel || 'L');
			qr.addData(text);
			qr.make();

			return qr.createImgTag();
		},

		//draw:	function(text, typeNumber, errorCorrectLevel){document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );},

		update: function(){
			var text = "coming soon";
			$('#qr').html(this.create(text));
		}

	};

	var DD = {

		enable: function(){

			$('body').on({
				drop: function(event){ DD.onDrop(event) },
				dragover: function(event){ DD.onDragOver(event) },
				dragleave: function(event){ DD.onDragLeave(event)}
			});

		},

		onDrop: function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			Phone.setHighlight(false);

			var files = evt.originalEvent.dataTransfer.files; // FileList object.

			// files is a FileList of File objects. List some properties.
			for (var i = 0, f; f = files[i]; i++) {

				File.upload(f);
				var reader = new FileReader();

				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						$('.screen').css({
						  backgroundImage: 'url(' + e.target.result + ')'
						})

					};
				})(f);

		      // Read in the image file as a data URL.
		      reader.readAsDataURL(f);
		      //reader.readAsText(f);
			}

		},

		onDragOver: function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			if( !Phone.isHighlighted() ) Phone.setHighlight(true);
		},

		onDragLeave: function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			Phone.setHighlight(false);
		}

	};


	var Phone = {

		$screen: $('.screen'),

		setHighlight: function(bool){
			(bool) ? this.$screen.addClass('highlight') : this.$screen.removeClass('highlight');
		},

		isHighlighted: function(){
			return ( this.$screen.hasClass('highlight') );
		},

    pair: function(id){

      this.$screen.text(id).addClass('pair');
      console.log(id);

    }

	}

	var File = {

		upload: function(file){

      var formData = new FormData();
      formData.append(file.name, file);
      formData.append('id', App.id);
      console.log('id is: ' + App.id);
      console.debug(file);

//      for (var i = 0, file; file = files[i]; ++i) {
//        formData.append(file.name, file);
//      }

      var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://localhost:8000/upload', true);
			xhr.onload = function(e) {
			    if (this.status == 200) {
			      console.log(this.responseText);
            App.socket.emit('new file uploaded','test');
			    }
			};

			xhr.send(formData);
		}

	}


  var App = {

    id: null,
    paired: null,
    socket: io.connect('http://localhost:8000'),
    cookie: {
      name: 'com.linkedin.mobile.inmobileviewer',
      expires: 365,
      path: '/'
    },

    init: function(){
      QR.update();
      DD.enable();
      //this.connect();

      this.connect();
      //Pair.newDevice();

    },

    connect: function(){
      this.id = $.cookie(this.cookie.name);
      console.log('id from cookie: ' + this.id);

      if(this.id){
        this.paired = true;
        //return this.id;
      } else{
        this.paired = false;
        this.pair();
      }

    },

    pair: function(){

      // check if already paired
      if(this.paired) return false;

			var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:8000/pair/', true);
			xhr.onload = function(e) {
			    if (this.status == 200) {
            var res = $.parseJSON(this.responseText);
			      console.debug(res);
            Phone.pair(res.id);
            App.pairSuccess(res.id);
			    }
			};

			xhr.send(null);

      //if not, setup a new device
      //Phone.pairNewDevice('');

    },

    pairSuccess: function(id){
      // create folder in server matching id
      // enable drag and drop
      // add cookie with id

      $.cookie(this.cookie.name, id);
      this.id = id;

      console.log('id in cookie: ' + $.cookie(this.cookie.name));

    },

    _createCookie: function(){
      $.cookie(this.cookie.name, {expires: this.cookie.expires, path:this.cookie.path});
    },

    _removeCookie: function(){
      $.removeCookie(this.cookie.name, {expires: this.cookie.expires, path:this.cookie.path});
    }

  }

  //$.removeCookie(App.cookie.name);
  App.init();

  var socket = io.connect('http://localhost:8000');

  socket.on('app', function (data){
    socket.emit('forViewer', 'hello viewer from app 2');
    console.log(data);
  });

  /*
  socket.on('file uploaded viewer', function (data) {
    console.log('socket event: file uploaded viewer');
    console.log(data);
  //App.socket.emit('my other event', { my: 'data' });
  });
  */

  //socket.emit('forViewer', {hello: 'world from app'});


});
