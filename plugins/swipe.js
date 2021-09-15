( function( $, window, document, undefined ) {
	"use strict";

	var pluginName = "swipe";

	function swipedetect(el, callback){
		this.element = el
		this._name = pluginName;
		
		var touchsurface = $(this.element),
		swipedir,
		startX,
		startY,
		dist,
		distX,
		distY,
		threshold = 150, //required min distance traveled to be considered swipe
		restraint = 100, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 300, // maximum time allowed to travel that distance
		elapsedTime,
		startTime,
		handleswipe = callback || function(swipedir,e){};

		touchsurface.on('touchstart', function(e){
			var touchobj = e.changedTouches[0]
			swipedir = 'none'
			dist = 0
			startX = touchobj.pageX
			startY = touchobj.pageY
			startTime = new Date().getTime() // record time when finger first makes contact with surface
			// e.preventDefault()
		})
		touchsurface.on('touchmove', function(e){
				// e.preventDefault() // prevent scrolling when inside DIV
		})

		touchsurface.on('touchend', function(e){
				var touchobj = e.changedTouches[0]
				distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
				distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
				elapsedTime = new Date().getTime() - startTime // get time elapsed
				if (elapsedTime <= allowedTime){ // first condition for awipe met
						if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
								swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
						}
						else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
								swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
						}
				}
				handleswipe(swipedir,e)
				// e.preventDefault()
		})
	}

	//USAGE:

	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" +
					pluginName, new swipedetect( this, options ) );
			}
		} );
	};
})( jQuery );