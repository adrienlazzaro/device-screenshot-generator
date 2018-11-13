$(function() {

	var useLocalHost = true;
	var serverRoot = (useLocalHost) ? 'localhost:8888' : 'scream-ld.linkedin.biz/~alazzaro/in_mobile_viewer';
	var serverURL = 'http://' + serverRoot;


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
		
		onDrop: function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			removeScreenshotHighlight();
			
			var files = evt.dataTransfer.files; // FileList object.
			
			// files is a FileList of File objects. List some properties.
			for (var i = 0, f; f = files[i]; i++) {
		
				upload(f);	
				var reader = new FileReader();
		
				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						$('.screenshot').css({
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
			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
			addScreenshotHighlight();
		},
		
		onDragLeave: function(evt){
			evt.stopPropagation();
			evt.preventDefault();
			removeScreenshotHighlight();
		}
		
	};
	
	var json;
	
	function handleFileSelect(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		removeScreenshotHighlight();
		
		var files = evt.dataTransfer.files; // FileList object.
		
		// files is a FileList of File objects. List some properties.
	
		for (var i = 0, f; f = files[i]; i++) {
	
			upload(f);

			if (!f.type.match('image.*')) {
				console.log('other type = ' + f.type);
				
			} else {
				console.log('image type = ' + f.type);
			}

		  var reader = new FileReader();
	
	      // Closure to capture the file information.
	      reader.onload = (function(theFile) {
	        return function(e) {
	          // Render thumbnail.

	          $('.screenshot').css({
		          backgroundImage: 'url(' + e.target.result + ')'
	          })

/*
				console.log(e.target.result);
				json = $.parseJSON(e.target.result);
				console.log(json);
*/

	        };
	      })(f);
	
	      // Read in the image file as a data URL.
	      reader.readAsDataURL(f);
	      //reader.readAsText(f);
	
		}
	
	}
	
	function upload(file) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', serverURL + '/php/post_file.php', true);
		xhr.setRequestHeader("X_FILENAME", file.name);
		xhr.onload = function(e) {
		    if (this.status == 200) {
		      console.log(this.responseText);
		    }
		};
		
		// Listen to the upload progress.
/*
		var progressBar = document.querySelector('progress');
		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				progressBar.value = (e.loaded / e.total) * 100;
				progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
			}
		};
*/
		
		xhr.send(file);
	}
	
/*
	function handleDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		addScreenshotHighlight();
	}
	
	function handleDragOut(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		removeScreenshotHighlight();
	}
*/
	
	function addScreenshotHighlight(){
		$('.screenshot').addClass('dragover');
	}
	
	function removeScreenshotHighlight(){
		$('.screenshot').removeClass('dragover');
	}
	
	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
/*
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
	dropZone.addEventListener('dragleave', handleDragOut, false);
*/

	dropZone.addEventListener('drop', DD.onDrop, false);
	dropZone.addEventListener('dragover', DD.onDragOver, false);
	dropZone.addEventListener('dragleave', DD.onDragLeave, false);

		
	QR.update();
//	update_qrcode();
     
});
