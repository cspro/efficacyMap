	var mouseX = 0;
	var mouseY = 0;
	var current = null;
	var isPin = false;

	var stateColor1 = '#364395';
	var stateColor2 = '#205f9f';
	var stateColor3 = '#006da4';
	var stateColor4 = '#0080aa';
	var stateColor5 = '#0089b7';
	var disabledColor = '#bbb';
	var hoverColor = '#7db658';
	var strokeColor = '#ffffff';
	var abbrColor = '#ffffff';
	var mapWidth = 1000;
	var mapHeight = 550;
	var textAreaWidth = 300;
	var textAreaPadding = 10;
	var textAreaHeight = 300;
	var responsive = false;
	var useParameterInUrl = false;
	
	var ratio = mapWidth / mapHeight;
	var startingMapWidth = mapWidth;
	
	var win = $(window);
	var winWidth = win.width();
	
	var r; // Raphael object

	function createMap(scope, stateConfig) {

		var shapes = [];
		var stateIds = {};

		//start map
		r = new ScaleRaphael('map', 930, 590); 
		
		var attributes = {
			'fill' : '#d9d9d9',
			'cursor' : 'pointer',
			'stroke' : strokeColor,
			'stroke-width' : 2,
			'stroke-linejoin' : 'round',
			'font-family' : 'Verdana',
			'font-size' : '19px',
			'font-weight' : 'bold'
		};

		var shapeAttrs = {
			'cursor' : 'pointer',
			'stroke' : strokeColor,
		};
		
		
		var i = 0;

		for (var stateId in stateConfig) {
			
			var raphaelSet = r.set();
			raphaelSet.attr(attributes);
			
			var stateObj = stateConfig[stateId];
			
			shapeAttrs['id'] =	'id';
			shapeAttrs['opacity'] = 1;
			var stateColor;
			if (stateObj.count > 0 && stateObj.count <= 3) {
				stateColor = stateColor5;
			} else if (stateObj.count >= 4 && stateObj.count <= 6) {
				stateColor = stateColor3;
			} else if (stateObj.count >= 7 && stateObj.count <= 9) {
				stateColor = stateColor2;
			} else if (stateObj.count >= 10) {
				stateColor = stateColor1;
			}
			shapeAttrs['fill'] = stateObj.enabled ? stateColor : disabledColor;
			stateObj.color = stateColor;
			stateIds[i] = stateId;

			raphaelSet.push(r.path(stateObj.path).attr(shapeAttrs));
			raphaelSet.push(r.text(stateObj.textX, stateObj.textY, stateObj.abbr).attr({
				'font-family' : "Open Sans, sans-serif",
				'font-weight' : "bold",
				'font-size'   : "14",
				'fill'        : abbrColor,
				'cursor'      : 'pointer',
				'z-index'     : 1000,
				'dy'          : 0
			}));

			raphaelSet[0].node.id = stateId;
			raphaelSet[1].toFront();

			shapes[stateId] = raphaelSet[0];

			var hitArea = r.path(stateObj.path).attr({
				'fill' : "#f00",
				'stroke-width' : 0,
				'opacity' : 0,
				'cursor' : stateObj.enabled ? 'pointer' : 'not-allowed'
			});

			hitArea.node.id = stateId;
			
			hitArea.mouseover(function(e) {

				e.stopPropagation();

				var id = $(this.node).attr('id');
				var stateObj = stateConfig[id];

				if (stateObj.enabled) {
					shapes[id].animate({
						fill : hoverColor
					}, 250);
				}

				//tooltip
				$('#map').next('.tooltip').remove();
				$('#map').after($('<div />').addClass('tooltip'));
				$('.tooltip').html(stateObj['name']).css({
					'left' : mouseX - 50,
					'top' : mouseY - 40
				}).fadeIn();

			});

			hitArea.mouseout(function(e) {

				var id = $(this.node).attr('id');
				var stateObj = stateConfig[id];

				if (stateObj.enabled) {
					shapes[id].animate({
						fill : stateObj.enabled ? stateObj.color : disabledColor
					}, 500);
				}
				
				$('#map').next('.tooltip').remove();

			});

			hitArea.mouseup(function(e) {
				
				e.stopPropagation();

				var id = $(this.node).attr('id');
				var stateObj = stateConfig[id];
				var stateId = stateObj[id];

				if (stateObj.enabled) {

					//Animate previous state out
					if (current) {
						var currId = $(current.node).attr('id');
						var currObj = stateConfig[currId];
						current.animate({
							fill : currObj.color
						}, 500);
					}

					//Animate next
					shapes[id].animate({
						fill : hoverColor
					}, 500);

					current = shapes[id];
					
					scope.onStateClick(stateObj);
					scope.$digest();
					
					// $rootScope.$broadcast('stateClick', stateId);
					// console.log('broadcasting stateClick. stateId: ' + stateId);

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
			$(window).resize(function() {
				dynamicResize();
			});
		}
		dynamicResize();

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

		$(".mapContainer").css({
			'width' : mapWidth + 'px',
			'height' : mapHeight + 'px'
		});
	}
	
	function dynamicResize() {
		winWidth = win.width();
		mapWidth = winWidth >= startingMapWidth ? startingMapWidth : winWidth*1;
		mapHeight = mapWidth / ratio;
		resizeMap();
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