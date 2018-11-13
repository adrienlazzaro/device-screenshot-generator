$(function() {

  var useLocalHost = true;
  var serverRoot = (useLocalHost) ? 'localhost:8080' : 'alazzaro-mn1.linkedin.biz:8080';
  var serverURL = 'http://' + serverRoot;

/*
	var counter=0;

	function next(){
		(counter == 11) ? counter = 0 : counter++ ;
		apply();
	}

	function previous(){
		(counter == 0) ? counter = 0 : counter-- ;
		apply();
	}

	function apply(){
		$('div.paginate div').removeClass().addClass('screen p' + counter);
	}

	$('div.paginate').swipe({
	     swipeLeft: function() { next() },
	     swipeRight: function() { previous() },
	})

  function connect(){
    console.log('connected...');
  }
*/

  var socket = io.connect(serverURL);

  socket.on('viewer', function (data) {
    console.log(data);
  //App.socket.emit('my other event', { my: 'data' });
  });

  socket.on('new file uploaded', function (data) {
    console.log(data);
  //App.socket.emit('my other event', { my: 'data' });
  });

  $('#code').on('keyup', function(e){
     var text = $(this).val();

    if(text.length == 4){
      $(this).blur();

      var formData = new FormData();
      formData.append('code', $(this).val());
      console.log('code: ' + $(this).val());
  	
      var xhr = new XMLHttpRequest();
      xhr.open('POST', serverURL + '/pair/submit', true);
      xhr.onload = function(e) {
        if (this.status == 200) {
          var res = $.parseJSON(this.responseText);
  	      console.debug(res);
        }
      };
      
      xhr.send(formData);
      
    }

      //submit code to server
      //server to check code
      //if correct, create folder
      //send id back to client

  });

  //connect();

});
