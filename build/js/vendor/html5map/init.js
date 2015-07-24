$(function() {

	var stateNames = new Array();
	var stateURLs = new Array();
	var stateModes = new Array();
	var stateColors = new Array();
	var stateOverColors = new Array();
	var stateClickedColors = new Array();
	var stateText = new Array();

	var pinText = new Array();
	var pinNames = new Array();
	var pinUrls = new Array();
	var pinX = new Array();
	var pinY = new Array();
	var pinColors = new Array();
	var pinOverColors = new Array();
	var pinClickedColors = new Array();

	var offColor, strokeColor, offStrokeColor, abbrColor, mapWidth, mapHeight, useText, useTextAtBottom, textAreaWidth, textAreaPadding, win, winWidth, r, ratio, isMobile, pinSize, responsive, useParameterInUrl;

	var mouseX = 0;
	var mouseY = 0;
	var current = null;
	var isPin = false;

	// Detect if the browser supports ajax.
	var hasAjax = jQuery.support.ajax;

	stateColor = '#9d1348';
	hoverColor = '#ca2f45';
	strokeColor = '#ffffff';
	abbrColor = '#ffffff';
	mapWidth = 1000;
	mapHeight = 550;
	textAreaWidth = 300;
	textAreaPadding = 10;
	textAreaHeight = 300;
	responsive = true;
	useParameterInUrl = false;
	
	ratio = mapWidth / mapHeight;
	startingMapWidth = mapWidth;
	
	mapWidth = parseFloat(mapWidth, 10);
	startingMapWidth = mapWidth;
	mapHeight = mapWidth / ratio;
	
	win = $(window);
	winWidth = win.width();

	setTimeout(function() {
		createMap();
	}, 200);

	function createMap() {

		var shapeAr = [];

		//start map
		r = new ScaleRaphael('map', 930, 590); 
		attributes = {
			fill : '#d9d9d9',
			cursor : 'pointer',
			stroke : strokeColor,
			'stroke-width' : 2,
			'stroke-linejoin' : 'round',
			'font-family' : 'Verdana',
			'font-size' : '19px',
			'font-weight' : 'bold'
		};
		arr = new Array();

		var usa = {};

		usa.alabama = r.set();
		usa.alaska = r.set();
		usa.arizona = r.set();
		usa.arkansas = r.set();
		usa.california = r.set();
		usa.colorado = r.set();
		usa.connecticut = r.set();
		usa.delaware = r.set();
		usa.dc = r.set();
		usa.florida = r.set();
		usa.georgia = r.set();
		usa.hawaii = r.set();
		usa.idaho = r.set();
		usa.illinois = r.set();
		usa.indiana = r.set();
		usa.iowa = r.set();
		usa.kansas = r.set();
		usa.kentucky = r.set();
		usa.louisiana = r.set();
		usa.maine = r.set();
		usa.maryland = r.set();
		usa.massachusetts = r.set();
		usa.michigan = r.set();
		usa.minnesota = r.set();
		usa.mississippi = r.set();
		usa.missouri = r.set();
		usa.montana = r.set();
		usa.nebraska = r.set();
		usa.nevada = r.set();
		usa.newHampshire = r.set();
		usa.newJersey = r.set();
		usa.newMexixo = r.set();
		usa.newYork = r.set();
		usa.northCarolina = r.set();
		usa.northDakota = r.set();
		usa.ohio = r.set();
		usa.oklahoma = r.set();
		usa.oregon = r.set();
		usa.pennsylvenia = r.set();
		usa.rhodeIsland = r.set();
		usa.southCarolina = r.set();
		usa.southDakota = r.set();
		usa.tennessee = r.set();
		usa.texas = r.set();
		usa.utah = r.set();
		usa.vermont = r.set();
		usa.virginia = r.set();
		usa.washington = r.set();
		usa.westVirginia = r.set();
		usa.wisconsin = r.set();
		usa.wyoming = r.set();

		var boxattrs = {
			'cursor' : 'pointer',
			'fill' : "#fff"
		};
		var i = 0;

		for (var state in usamappaths) {

			//Create obj
			var obj = usa[state];
			obj.attr(attributes);
			
			var stateData = usamappaths[state];
			stateNames[i] = stateData.name;
			
			boxattrs = {
				'cursor' : 'pointer',
				'fill'   : stateColor,
				'stroke' : strokeColor,
				'id'     : i
			};

			obj.push(r.path(stateData.path).attr(boxattrs));
			obj.push(r.text(stateData.textX, stateData.textY, stateData.text).attr({
				"font-family" : "Open Sans, sans-serif",
				"font-weight" : "bold",
				"font-size"   : "14",
				"fill"        : abbrColor,
				'cursor'      : 'pointer',
				'z-index'     : 1000,
				'dy'          : 0
			}));

			obj[0].node.id = i;
			obj[1].toFront();

			shapeAr.push(obj[0]);

			var hitArea = r.path(stateData.path).attr({
				fill : "#f00",
				"stroke-width" : 0,
				"opacity" : 0,
				'cursor' : 'pointer'
			});

			hitArea.node.id = i;
			
			hitArea.mouseover(function(e) {

				e.stopPropagation();

				var id = $(this.node).attr('id');

				//Animate if not already the current state
				if (shapeAr[id] != current) {
					shapeAr[id].animate({
						fill : hoverColor
					}, 500);
				}

				//tooltip
				$('#map').next('.tooltip').remove();
				$('#map').after($('<div />').addClass('tooltip'));
				$('.tooltip').html(stateNames[id]).css({
					'left' : mouseX - 50,
					'top' : mouseY - 40
				}).fadeIn();

			});

			hitArea.mouseout(function(e) {

				var id = $(this.node).attr('id');

				if (stateModes[id] != 'OFF') {

					//Animate if not already the current state
					if (shapeAr[id] != current) {
						shapeAr[id].animate({
							fill : stateColor
						}, 500);
					}

					$('#map').next('.tooltip').remove();

				}

			});

			hitArea.mouseup(function(e) {

				var id = $(this.node).attr('id');

				if (stateModes[id] != 'OFF') {
					//Reset scrollbar
					var t = $('#text')[0];
					t.scrollLeft = 0;
					t.scrollTop = 0;

					//Animate previous state out
					if (current) {
						var curid = $(current.node).attr('id');
						current.animate({
							fill : isPin ? pinColors[curid] : stateColors[curid]
						}, 500);
					}
					isPin = false;

					//Animate next
					shapeAr[id].animate({
						fill : stateClickedColors[id]
					}, 500);

					current = shapeAr[id];

					if (useText == 'true') {
						$('#text').html(stateText[id]);
					} else {
						//change "_self" to "_blank" if using in WP iframe
						if (useParameterInUrl) {
							window.open(stateText[id], '_self');
						} else {
							window.open(stateURLs[id], '_self');
						}
					}
				}
			});

			i++;
		}

		if (responsive) {
			responsiveResize();
			$(window).resize(function() {
				responsiveResize();
			});
		} else {
			resizeMap(r);
		}

	}

	// Set up for mouse capture
	if (document.captureEvents && Event.MOUSEMOVE) {
		document.captureEvents(Event.MOUSEMOVE);
	}

	// Main function to retrieve mouse x-y pos.s

	function getMouseXY(e) {

		var scrollTop = $(window).scrollTop();

		if (e && e.pageX) {
			mouseX = e.pageX;
			mouseY = e.pageY - scrollTop;
		} else {
			mouseX = event.clientX + document.body.scrollLeft;
			mouseY = event.clientY + document.body.scrollTop;
		}
		// catch possible negative values
		if (mouseX < 0) {
			mouseX = 0;
		}
		if (mouseY < 0) {
			mouseY = 0;
		}

		$('#map').next('.tooltip').css({
			left : mouseX - 50,
			top : mouseY - 40
		});
	}

	// Set-up to use getMouseXY function onMouseMove
	document.body.onmousemove = getMouseXY;

	function resizeMap() {

		r.changeSize(mapWidth, mapHeight, true, false);

		$(".mapWrapper").css({
			'width' : mapWidth + 'px',
			'height' : mapHeight + 'px'
		});
	}

	function responsiveResize() {

		winWidth = win.width();

		if (winWidth >= 960) {
			mapWidth = startingMapWidth;
			mapHeight = mapWidth / ratio;
			resizeMap();
		} else if (winWidth < 960 && winWidth >= 768) {
			mapWidth =  728;
			mapHeight = mapWidth / ratio;
			resizeMap();
		} else if (winWidth < 480) {
			mapWidth = 280;
			mapHeight = mapWidth / ratio;
			resizeMap();
		} else if (winWidth < 768 && winWidth > 480) {
			mapWidth = 400;
			mapHeight = mapWidth / ratio;
			resizeMap();
		}

	}

}); 