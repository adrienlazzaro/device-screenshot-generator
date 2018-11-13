$(function() {

  var useLocalHost = true;
  var serverRoot = (useLocalHost) ? 'localhost:8080' : 'alazzaro-mn1.linkedin.biz:8080';
  var serverURL = 'http://' + serverRoot;


  Phone = {
    $screen: $('#screen'),
  
    showPairScreen: function(){
      this.$screen.addClass('unpaired');
      console.log('show pair screen');
    }
  }

  App = {
    id: null,
    paired: null,
    socket: io.connect(serverURL),
    cookie: {
      name: 'com.linkedin.mobile.inmobileviewer',
      expires: 365,
      path: '/'
    },

    init: function(){

      this._addEventListeners();
      this.id = this.getID();
      this.paired = (this.id) ? true: false;
      console.log(this.paired);
      console.log('init');
      if(!this.paired) Phone.showPairScreen();

    },
    
    getID: function(){
      return $.cookie(this.cookie.name);
    },
    
    _addEventListeners: function(){

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
    
      });      

    },
    
    _createCookie: function(){
      $.cookie(this.cookie.name, this.id);
      //$.cookie(this.cookie.name, {expires: this.cookie.expires, path:this.cookie.path});
    },

    _removeCookie: function(){
      $.removeCookie(this.cookie.name);
      //$.removeCookie(this.cookie.name, {expires: this.cookie.expires, path:this.cookie.path});
    }

  }

  var socket = io.connect(serverURL);

  socket.on('viewer', function (msg) {
  
    if(msg.event === "NEW_FILE_UPLOADED"){
/*
      var img = document.createElement('img');
      img.src = '../' + msg.data.url;
*/
      $('#screen').css('background-image', 'url(../' + msg.data.url + ')');
/*
      var screen = document.getElementById('screen');
      screen.display.style.backgroundImage = '../' + msg.data.url;
*/
//      screen.appendChild(img);
      
      console.log('screen:');
      console.log(screen);
      //screen.app(img);
    }
    console.log(msg);
  //App.socket.emit('my other event', { my: 'data' });
  });

  socket.on('new file uploaded', function (data) {
    console.log(data);
  //App.socket.emit('my other event', { my: 'data' });
  });
  
  App.init();


});
