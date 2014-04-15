$(document).ready(function(){

	function readURL(input) {

	    if (input.files && input.files[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            $('#uploaded-img').attr('src', e.target.result);
	            $('#store-logo').val(e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	$("#storeLogo").change(function(){
	    readURL(this);
	});



	document.getElementById('image-input').addEventListener('change', newUpload, false);

	$(window).keydown(function(event){
	  if(event.keyCode == 13) {
	    event.preventDefault();
	    return false;
	  }
	});

	if(jQuery.browser.mobile) {
	 	//window.OverlayImg = '/images/overlay_m.png';
	 	window.isMobile = true;
	} else {
		//window.OverlayImg = '/images/overlay.png';
		window.isMobile = false;
	};

	// Resize function on resizing the window
  window.onresize = resizeCanvas;

  // Obtain a canvas drawing surface from fabric.js
  window.canvas = new fabric.Canvas('insta-canvas');
  window.f = fabric.Image.filters;
  window.filters = {};

	window.containerWidth = $('#canvas-container').width();
	window.oriContWidth = containerWidth;
	window.canvasOffset = 0;


	// Setting canvas Height and setting minimums
  var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }
	canvas.setWidth(2000);

	// Initializing color pickers
	$("#colorpicker").spectrum({

	    color: "#111",
	    flat: true,
    	showInput: true,
    	clickoutFiresChange: true,
    	showAlpha: true,
    	showPalette: true,
	    palette: [
	        ['black', 'white', '#1abc9c', '#16a085', '#2ecc71','#27ae60','#f1c40f','#f39c12','#e67e22'],
	        ['#d35400','#e74c3c','#c0392b','#3498db','#2980b9','#34495e','#2c3e50','#9b59b6','#8e44ad']
	    ],
	    showButtons: false,
	    preferredFormat: "hex",
	    move: function(color) {
	    	var obj = canvas.getActiveObject();
    		var color = color.toRgbString();
    		obj.fill = color;
    		canvas.renderAll();
    		$('#font-textarea').css('color', color);
			}

	});

	$("#bkg-colorpicker").spectrum({

	    color: "#fff",
	    flat: true,
    	showInput: true,
    	clickoutFiresChange: true,
    	showPalette: true,
	    palette: [
	        ['black', 'white', '#1abc9c', '#16a085', '#2ecc71','#27ae60'],
	        ['#f1c40f','#f39c12','#e67e22','#d35400','#e74c3c','#c0392b'],
	        ['#3498db','#2980b9','#34495e','#2c3e50','#9b59b6','#8e44ad']
	    ],
	    showButtons: false,
	    preferredFormat: "hex",
	    move: function(color) {
    		var color = color.toRgbString();
    		canvas.item(0).fill = color;
    		canvas.renderAll();
    		console.log(color);
    		$('#outside-edge').css('border-color', color);
			}

			
	});

  // Adding clipart on clicks
  $('#clipart-box img').click(function(){
  	var imgElement = this;
  	var containerWidth = $('#canvas-container').width();
		var image = new fabric.Image(imgElement, {
		  left: containerWidth/2 - canvasOffset,
		  top: 240,
    	transparentCorners: true,
    	originX: 'center',
			originY: 'center',
			hasBorders: false,
  		lockUniScaling: true,
  		hasCorners: false,
  		borderColor: 'rgba(0,0,0,0)',
  		cornerColor: 'rgba(0,0,0,0)',
  		cornerSize: 20,
		});
		canvas.add(image);
		image.setCoords();
		canvas.setActiveObject(image);
  });

	// Events triggered on object selection
  canvas.on('object:selected', function(options) {
	  var obj = canvas.getActiveObject();
	  console.log(obj);
	  $('#options-box').removeClass("hidden");
	  $('#object-box').removeClass("hidden");
	  try{
	  	switch(obj.type)
		  {
		  	case "text":
		  		$('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#image-box').addClass('hidden');
		  	  $('#font-box').removeClass("hidden");
		  	  getFontInfo();
		  	  break;
		  	case "image":
		  	  $('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#font-box').addClass('hidden');
		  	  $('#image-box').removeClass("hidden");
		  	  break;
		  	default:
		  		$('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#font-box').addClass('hidden');
		  	  $('#image-box').addClass("hidden");
		  	  break;
		  };
	  }
	  catch(err){}

	  var index = canvas.getObjects().indexOf(obj);
	  var numIndex = canvas.getObjects().length - 1;

	  if(index<numIndex && index>1){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>1){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==1 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	  
	  moveButtons();

	});

	// Events triggered on object rotation
	canvas.on('object:rotating', function(options) {
	  
	  moveButtons();

	});

	// Events triggered on object modification
	canvas.on('object:modified', function(options) {
	  
	  moveButtons();

	});

	// Events triggered on object move
	canvas.on('object:moving', function(options) {

		moveButtons();

	});

	// Events triggered on object clear
	canvas.on('selection:cleared', function(options) {
	  var obj = canvas.getActiveObject();

	  $('#options-box').addClass("hidden");
	  $('#object-box').addClass("hidden");
	  $('#font-box').addClass("hidden");
	  $('#image-box').addClass("hidden");
	  $('#move-up-icon').addClass("hidden");
	  $('#move-down-icon').addClass("hidden");

	});


	// Listen for text area changes and change font with it
	$('#font-textarea').bind('input propertychange', function() {
		var obj = canvas.getActiveObject();
		obj.text = $('#font-textarea').val();
		canvas.renderAll();
		moveButtons();
	});

	// Set initial price
	$('#order-quantity').val(1);
	/*var phoneCase = new fabric.Rect({
	  originY: "top",
	  originX: "center",
	  left: containerWidth / 2,
    top: 20,  
	  fill: 'white',
	  width: 250,
	  height: 460,
	  rx: 46,
	  ry: 46,
	  selectable: false,
	});*/

	//canvas.add(phoneCase);

	//Upload a new image
	$('#upload-icon').click(function(){
		$('#image-input').click();
	});

	//Get rid of object - legacy name
	$('#text-remove-icon').click(function(){
		canvas.remove(canvas.getActiveObject());
	});

	//Add text
	$('#text-icon').click(function(){
		
		var containerWidth = $('#canvas-container').width();
		var text = new fabric.Text("", { 
			left: containerWidth/2 - canvasOffset,
			top: 240,
			fontFamily: "Lato",
			fontSize: 24,
			lockUniScaling: true,
			hasBorders: false,
			hasCorners: false,
			transparentCorners: true,
			originX: 'center',
			originY: 'center',
			borderColor: 'rgba(0,0,0,0)',
			cornerColor: 'rgba(0,0,0,0)',
			cornerSize: 20,
			stateProperties: 'top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule shadow clipTo visible backgroundColor lockUniScaling hasBorders hasCorners transparentCorners borderColor cornerColor cornerSize'.split(' ')
		});

		canvas.add(text);
		canvas.setActiveObject(text);
		showEditor();
		$('#font-textarea').focus();

	});

	//Edit object - might be legacy
	$('#edit-icon').click(function(){
		showEditor();
	});

	//Align text left
	$('#align-left').click(function(){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "left";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').addClass('chosen');
		$('#align-center').removeClass('chosen');
		$('#align-right').removeClass('chosen');
	});

	//Align text center
	$('#align-center').click(function(){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "center";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').removeClass('chosen');
		$('#align-center').addClass('chosen');
		$('#align-right').removeClass('chosen');
	});

	//Align text right
	$('#align-right').click(function(){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "right";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').removeClass('chosen');
		$('#align-center').removeClass('chosen');
		$('#align-right').addClass('chosen');
	});

	//Select font family
	$('#font-selector').change(function(){
		var obj = canvas.getActiveObject(); 
		$('#font-textarea').css('font-family', $('#font-selector').val());
		obj.fontFamily = $('#font-selector').val();
		canvas.renderAll();
		moveButtons();
	});

	//Open clipart menu
	$('#clipart-icon').click(function(){
		$('#font-box').addClass('hidden');
		$('#image-box').addClass('hidden');
		$('#clipart-box').removeClass('hidden');
		$('#background-box').addClass('hidden');
	});

	//Open background color menu
	$('#background-icon').click(function(){
		$('#font-box').addClass('hidden');
		$('#image-box').addClass('hidden');
		$('#clipart-box').addClass('hidden');
		$('#background-box').removeClass('hidden');
	});

	//Close menus
	$('.close-button').click(function(){
		$('#font-box').addClass('hidden');
		$('#image-box').addClass('hidden');
		$('#clipart-box').addClass('hidden');
		$('#background-box').addClass('hidden');
	});

	//See outside edges / don't print
	$('#order-edges').click(function(){
		$('#outside-edge').toggleClass('hidden')
	});

	// Object mpve to front / back options
	$('#move-up-icon').click(function(){
		var obj = canvas.getActiveObject();
	  var numIndex = canvas.getObjects().length - 1;
	  canvas.moveTo(obj, numIndex);

	  var index = canvas.getObjects().indexOf(obj);

	  if(index<numIndex && index>1){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>1){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==1 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	});

	$('#move-down-icon').click(function(){
		var obj = canvas.getActiveObject();
	  canvas.moveTo(obj, 1);

	  var index = canvas.getObjects().indexOf(obj);
	  var numIndex = canvas.getObjects().length - 1;

	  if(index<numIndex && index>1){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>1){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==1 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	});

	// Image Filters

	$('#filter-Grayscale').click(function(event){
    var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(0, enabled && new f.Grayscale());
	});

	$('#filter-Sepia2').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(1, enabled && new f.Sepia2());
	});

	$('#filter-Sepia').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(2, enabled && new f.Sepia());
	});

	$('#filter-Blur').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(3, enabled && new f.Convolute({
      matrix: [ 1/9, 1/9, 1/9,
                1/9, 1/9, 1/9,
                1/9, 1/9, 1/9 ]
    }));
	});

	$('#filter-Sharpen').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(3, enabled && new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
	});

	$('#filter-Emboss').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(4, enabled && new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
	});

  $('#filter-tint-color').click(function(event){
      var element = event.currentTarget;
      applyFilter(5, element.checked && new f.Tint({
          color: document.getElementById('filter-tint-color-intensity').value,
          opacity: parseFloat(document.getElementById('filter-tint-color-opacity').value)
      }));
  });

  $('#filter-tint-color-intensity').change(function(event){
      var element = event.currentTarget;
      applyFilterValue(5, 'color', element.value);
  });

  $('#filter-tint-color-opacity').change(function(event){
      var element = event.currentTarget;
      applyFilterValue(5, 'opacity', element.value);
  });

  $('#filter-brighten').click(function(event){
      var enabled = toggleFilterButton(event.currentTarget);
      applyFilter(6, enabled && new f.Brightness({
          brightness: parseInt(document.getElementById('filter-brighten-intensity').value, 10)
      }));
  });

  $('#filter-brighten-intensity').change(function(event){
      var element = event.currentTarget;
      applyFilterValue(6, 'brightness', parseInt(element.value, 10));
  });

  $('#filter-pixelate').click(function(event){
      var element = event.currentTarget;
      applyFilter(8, element.checked && new f.Pixelate({
          blocksize: parseInt(document.getElementById('filter-pixelate-intensity').value, 10)
      }));
  });

  $('#filter-pixelate-intensity').change(function(event){
      var element = event.currentTarget;
      applyFilterValue(8, 'blocksize', parseInt(element.value, 10));
  });

 	$('canvas').click(function(event){
 		$('#clipart-box').addClass('hidden');
		$('#background-box').addClass('hidden');
  });



	// Order Options

	$('#order-quantity').change(function(event){
		var quantity = $('#order-quantity').val();
		setPrice(quantity);
	});

	$('#order-checkout').click(function(event){
		$('#order_canvas').val(JSON.stringify(canvas.toDatalessJSON()));

		var containerWidth = $('#canvas-container').width();

		$('#order_image').val(canvas.toDataURL({ left:  containerWidth / 2 - canvasOffset - 145, top: 10, width: 290, height: 500 }));
		$('#order_startW').val(oriContWidth);
		var name = $('#template-name').val();
		var description = $('#template-description').val();
		$('#order_name').val(name);
		$('#order_description').val(description);
		$('#submit-new').click();

	});

	$('#order-save').click(function(event){
		console.log("save");
		$('#order_canvas').val(JSON.stringify(canvas.toDatalessJSON()));

		var containerWidth = $('#canvas-container').width();

		$('#order_image').val(canvas.toDataURL({ left:  containerWidth / 2 - canvasOffset - 145, top: 10, width: 290, height: 500 }));
		$('#order_startW').val(oriContWidth);
		$('#submit-save').click();

	});

	if ($('#order_canvas').val()){
		console.log('loading from canvas');
		canvas.loadFromDatalessJSON($('#order_canvas').val());
		if ($('#order_quantity').val()==0){
			$('#order-quantity').val(1);
		} else{
			$('#order-quantity').val($('#order_quantity').val());
		}
		
	  setPrice($('#order_quantity').val());

		canvas.renderAll();



	} else {

		var phoneBkg = new fabric.Rect({
		  originY: "top",
		  originX: "center",
		  left: containerWidth / 2,
	    top: 10,  
		  fill: 'white',
		  width: 290,
		  height: 500,
		  rx: 66,
		  ry: 66,
		  selectable: false,
		});
		canvas.add(phoneBkg);
		$('#order_startW').val(oriContWidth);
	};

	canvas.renderAll();

});

setTimeout(function(){
	
	console.log("First attempt")
	var obj = canvas.item(0);
	obj.selectable = false;

	if (obj){
		for (var i=1;i<canvas.getObjects().length;i++)
			{ 
				var obj = canvas.item(i);
				obj.set({
					transparentCorners: true,
				  hasBorders: false,
					lockUniScaling: true,
					hasCorners: false,
					borderColor: 'rgba(0,0,0,0)',
					cornerColor: 'rgba(0,0,0,0)',
					cornerSize: 20,
				});
			}

		oriContWidth = $('#order_startW').val();
		
		resizeCanvas();
		canvas.calcOffset();
		canvas.renderAll();
		$('#order_canvas').val(JSON.stringify(canvas.toDatalessJSON()));
		var newimage = canvas.toDataURL({ left:  containerWidth / 2 - canvasOffset - 145, top: 10, width: 290, height: 500 });
		$('#order_image').val(newimage);
		$('#main-face').css('background-image', 'url(\'' + newimage + '\')')



	} else {
		setTimeout(function(){
			console.log("Second attempt")
			var obj = canvas.item(0);
			obj.selectable = false;

			if (obj){
				var obj = canvas.item(1);
				obj.set({
					transparentCorners: true,
				  hasBorders: false,
					lockUniScaling: true,
					hasCorners: false,
					borderColor: 'rgba(0,0,0,0)',
					cornerColor: 'rgba(0,0,0,0)',
					cornerSize: 20,
				});

				oriContWidth = $('#order_startW').val();
				
				resizeCanvas();
				canvas.calcOffset();
				canvas.renderAll();
			} else {
				setTimeout(function(){
					console.log("Third attempt")
					var obj = canvas.item(0);
					obj.selectable = false;

					if (obj){
						var obj = canvas.item(1);
						obj.set({
							transparentCorners: true,
						  hasBorders: false,
							lockUniScaling: true,
							hasCorners: false,
							borderColor: 'rgba(0,0,0,0)',
							cornerColor: 'rgba(0,0,0,0)',
							cornerSize: 20,
						});

						oriContWidth = $('#order_startW').val();
						
						resizeCanvas();
						canvas.calcOffset();
						canvas.renderAll();
					} else {
						console.log("Something is wrong");
					}
				}, 1000);
			}
		}, 1000);
	}
}, 500);

/*

	'click #copy-icon': function(event){
		var obj = canvas.getActiveObject();
		var clone = obj.clone();
		canvas.add(clone);
		clone.set({
			top: obj.top + 5,
			left: obj.left + 5,
		})
		canvas.renderAll();
	},

*/



function newUpload(evt) {
	var reader = new FileReader();
	var containerWidth = $('#canvas-container').width();
	reader.onload = function(event) { console.log ('loading reader');
		var imgObj = new Image()

		imgObj.src = event.target.result;
		imgObj.onload = function(){
			// start fabricJS stuff

			var image = new fabric.Image(imgObj);
			image.set({
				originX: 'center',
				originY: 'center',
				left: containerWidth/2 - canvasOffset,
				top: 240,
				offLeft: 0,
				offTop: 0,
				angle: 0,
    		transparentCorners: true,
    		hasBorders: false,
    		lockUniScaling: true,
    		hasCorners: false,
    		borderColor: 'rgba(0,0,0,0)',
  			cornerColor: 'rgba(0,0,0,0)',
    		cornerSize: 20,
			});
			image.set({
				scaleY: 260 / (image.width),
    		scaleX: 260/ (image.width),
			});			
			canvas.add(image);
			image.setCoords();
			canvas.setActiveObject(image);
		
		}
	$("#image-input").val('');
	}
	reader.readAsDataURL(evt.target.files[0]);
	
};
function moveButtons(){
	var obj = canvas.getActiveObject();
	var	rX = (obj.currentWidth / 2);
	var	rY = (obj.currentHeight / 2);
	var X = obj.left - rX;
	var Y = obj.top - rY;
	var r = Math.pow(Math.pow(rX, 2) + Math.pow(rY, 2), 0.5) + 30;
	var theta = ((obj.angle) * Math.PI / 180) + Math.atan(rY/rX);

	var optionsH = $('#options-box').height();
	var optionsW = $('#options-box').width();

  var IconX = obj.left - r * Math.cos(theta) - optionsW/2;
  var IconY = obj.top - r * Math.sin(theta) - optionsH/2;

  $('#options-box').css("left", IconX + canvasOffset);
	$('#options-box').css("top", IconY);
	$('#options-box').css("transform", "rotate(" + obj.angle + "deg)");
	obj.setCoords();

	$('#object-box').css("width", rX*2);
	$('#object-box').css("height", rY*2);
	$('#object-box').css("left", X + canvasOffset);
	$('#object-box').css("top", Y);
	$('#object-box').css("transform", "rotate(" + obj.angle + "deg)");
	obj.setCoords();

};
function resizeCanvas(){

	canvasOffset = -(oriContWidth - $('#canvas-container').width())/2;

	$('#order_offset').val(canvasOffset);
	$('.canvas-container').css("left", canvasOffset);

	if(canvas.getActiveObject()){
		moveButtons();
	};

	canvas.renderAll();



	//resetting size of Canvas
	/*var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }*/


	// canvas.setWidth($('#canvas-container').width());

	//setting OverLay Image
	//canvas.overlayImage = null;


	//set Canvas Height and Width
	/*var cWidth = canvas.getWidth() + 0.0;

	var phoneBkg = canvas.item(1);
	var phoneCase = canvas.item(0);
	var cCenterLeft = cWidth / 2;

	var outsideW = $('#outside-border').width();
	var outsideH = $('#outside-border').width();
	var insideW = $('#inside-border').width();
	var insideH = $('#inside-border').width();

	phoneBkg.set({
		left: cCenterLeft+1,
	});
	phoneCase.set({
		left: cCenterLeft+1,
	});
	canvas.renderAll(); */

};
function getFontInfo(){

	var obj = canvas.getActiveObject();
	var family = obj.fontFamily;
	var text = obj.text;
	var align = obj.textAlign;
	var color = obj.fill;

	/*var color = obj.fill.match(/\((\d+),(\d+),(\d+)\)/);
	var hexcolor = rgbToHex(color[1], color[2], color[3]);
	document.getElementById('color-selector').color.fromString(hexcolor);*/

	$('#font-selector').val(family);
	
	switch(align)
	{
		case "left":
			$('#align-left').addClass('chosen');
			$('#align-center').removeClass('chosen');
			$('#align-right').removeClass('chosen');
			break;
		case "center":
			$('#align-left').removeClass('chosen');
			$('#align-center').addClass('chosen');
			$('#align-right').removeClass('chosen');
			break;
		case "right":
			$('#align-left').removeClass('chosen');
			$('#align-center').removeClass('chosen');
			$('#align-right').addClass('chosen');
			break;
	};

	// Turn textarea into formatted text
	//$('#font-textarea').css('color', "#" + hexcolor);
	$('#font-textarea').val(text);
	$('#font-textarea').css('text-align', align);
	$('#font-textarea').css('font-family', family);
	$('#font-textarea').css('color', color);
	$('#colorpicker').spectrum("set", color);


};

// Show Font Editor
function showEditor(){
	$('#font-box').removeClass("hidden");
	getFontInfo();
};

/**
 * Toggles the given filter button on or off
 * @param {HTMLElement} button The button to toggle
 * @return {boolean} the new toggle status of the button
 */
function toggleFilterButton(button) {
    var $button = $(button);
    $button.toggleClass('filter-enabled');
    return $button.hasClass('filter-enabled');
};

// Apply Filter to Object
function applyFilter(index, filter) {
  var obj = canvas.getActiveObject();
  obj.filters[index] = filter;
  obj.applyFilters(canvas.renderAll.bind(canvas));
};

// Apply Filter Value to Object
function applyFilterValue(index, prop, value) {
  var obj = canvas.getActiveObject();
  if (obj.filters[index]) {
    obj.filters[index][prop] = value;
    obj.applyFilters(canvas.renderAll.bind(canvas));
  }
};

// Set Total Price
function setPrice(value) {
	var total = value * $('#order_price').val();
	$('#order-value').html(total);
	$('#order_quantity').val(value);
};
